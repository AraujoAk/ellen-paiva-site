import { useEffect, useMemo, useRef, useState } from 'react';
import { magazineCategories } from '../Magazine/magazineFallback.js';
import { slugify } from '../../utils/slugify.js';

const CATEGORIES = magazineCategories.filter((category) => category !== 'Todos');
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MIN_DESCRIPTION_LENGTH = 10;
const RECOMMENDED_DESCRIPTION_LENGTH = 80;
const MIN_CONTENT_LENGTH = 500;

const emptyPost = {
  title: '',
  slug: '',
  category: 'Estilo inteligente',
  description: '',
  content: '',
  image_url: '',
  image_path: '',
  status: 'inactive',
  published_at: '',
};

function FieldTitle({ children, tooltip }) {
  return (
    <span className="admin-field-title">
      {children}
      {tooltip && (
        <span className="admin-field-tooltip" tabIndex="0" aria-label={tooltip}>
          ⓘ
          <span role="tooltip">{tooltip}</span>
        </span>
      )}
    </span>
  );
}

function toDatetimeLocal(date) {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString().slice(0, 16);
}

function fromDatetimeLocal(date) {
  if (!date) {
    return null;
  }

  return new Date(date).toISOString();
}

function formatLibraryDate(date) {
  if (!date) {
    return 'Sem data';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function getFriendlyImageName(name) {
  const withoutTimestamp = name.replace(/^\d+-/, '');
  const withoutHash = withoutTimestamp.replace(/^[a-f0-9]{24,64}\./i, 'imagem-editorial.');

  return withoutHash || 'Imagem editorial';
}

function getImageExtension(name) {
  return name.split('.').pop()?.toLowerCase() || '';
}

function getSeoAssistantData(post, previewImage) {
  const title = post.title.trim();
  const description = post.description.trim();
  const content = post.content.trim();
  const slug = post.slug.trim() || slugify(title);
  const checks = [
    {
      key: 'title',
      label: 'Titulo preenchido',
      isValid: Boolean(title),
      hint: 'Informe um titulo claro para o editorial.',
    },
    {
      key: 'description',
      label: 'Descricao curta adequada',
      isValid: description.length >= RECOMMENDED_DESCRIPTION_LENGTH,
      hint:
        description.length >= MIN_DESCRIPTION_LENGTH
          ? `A descricao pode ficar mais forte com pelo menos ${RECOMMENDED_DESCRIPTION_LENGTH} caracteres.`
          : 'Escreva uma descricao curta para o Google e compartilhamentos.',
    },
    {
      key: 'image',
      label: 'Imagem adicionada',
      isValid: Boolean(previewImage),
      hint: 'Adicione uma imagem editorial para a Revista e redes sociais.',
    },
    {
      key: 'content',
      label: 'Conteudo completo consistente',
      isValid: content.length >= MIN_CONTENT_LENGTH,
      hint: `O conteudo deve ter pelo menos ${MIN_CONTENT_LENGTH} caracteres para ter mais profundidade editorial.`,
    },
    {
      key: 'slug',
      label: 'Slug preenchido',
      isValid: Boolean(slug),
      hint: 'Defina o endereco final do artigo.',
    },
  ];
  const score = checks.filter((check) => check.isValid).length;
  const rating =
    score === 5
      ? 'Excelente'
      : score === 4
        ? 'Bom'
        : score >= 2
          ? 'Regular'
          : 'Ruim';

  return {
    checks,
    rating,
    score,
    slug,
    url: `/revista/${slug || 'slug-do-artigo'}`,
  };
}

function AdminPostForm({ post, isSaving, onSave, onUploadImage, onListImages, onResetComplete }) {
  const [formData, setFormData] = useState(emptyPost);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [libraryError, setLibraryError] = useState('');
  const [libraryImages, setLibraryImages] = useState([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [librarySort, setLibrarySort] = useState('newest');
  const fileInputRef = useRef(null);

  const isEditing = Boolean(post?.id);

  function clearFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function resetLocalForm() {
    setFormData(emptyPost);
    setImageFile(null);
    setError('');
    setFieldErrors({});
    setUploadMessage('');
    setIsUploadingImage(false);
    setIsLibraryOpen(false);
    setLibraryError('');
    setLibraryImages([]);
    setLibrarySearch('');
    setLibraryFilter('all');
    setLibrarySort('newest');
    clearFileInput();
  }

  useEffect(() => {
    setFormData({
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      category: post?.category ?? 'Estilo inteligente',
      description: post?.description ?? '',
      content: post?.content ?? '',
      image_url: post?.image_url ?? '',
      image_path: post?.image_path ?? '',
      status: post?.status ?? 'inactive',
      published_at: toDatetimeLocal(post?.published_at),
    });
    setImageFile(null);
    setError('');
    setFieldErrors({});
    setUploadMessage('');
    setIsUploadingImage(false);
    setLibraryError('');
    clearFileInput();
  }, [post]);

  const previewImage = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return formData.image_url;
  }, [formData.image_url, imageFile]);

  const visibleLibraryImages = useMemo(() => {
    const normalizedSearch = librarySearch.trim().toLowerCase();

    return [...libraryImages]
      .filter((image) => {
        const extension = getImageExtension(image.name);
        const matchesFilter = libraryFilter === 'all' || extension === libraryFilter;

        if (!matchesFilter) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        return [image.name, getFriendlyImageName(image.name), formatLibraryDate(image.createdAt)]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((firstImage, secondImage) => {
        const firstDate = new Date(firstImage.createdAt || 0).getTime();
        const secondDate = new Date(secondImage.createdAt || 0).getTime();

        return librarySort === 'oldest' ? firstDate - secondDate : secondDate - firstDate;
      });
  }, [libraryFilter, libraryImages, librarySearch, librarySort]);

  const seoAssistant = useMemo(
    () => getSeoAssistantData(formData, previewImage),
    [formData, previewImage],
  );

  useEffect(
    () => () => {
      if (previewImage?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    },
    [previewImage],
  );

  useEffect(() => {
    if (!isLibraryOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsLibraryOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLibraryOpen]);

  useEffect(() => {
    if (!isLibraryOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLibraryOpen]);

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'title' && !current.slug ? { slug: slugify(value) } : {}),
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: '',
    }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setImageFile(null);
      setUploadMessage('');
      setFieldErrors((current) => ({ ...current, image: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Envie um arquivo de imagem.');
      setFieldErrors((current) => ({
        ...current,
        image: 'Envie uma imagem em WebP, JPG ou PNG.',
      }));
      setUploadMessage('');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('A imagem deve ter ate 4 MB.');
      setFieldErrors((current) => ({
        ...current,
        image: 'A imagem deve ter ate 4 MB.',
      }));
      setUploadMessage('');
      event.target.value = '';
      return;
    }

    setError('');
    setFieldErrors((current) => ({ ...current, image: '' }));
    setUploadMessage('Enviando imagem...');
    setImageFile(file);

    try {
      setIsUploadingImage(true);
      const imagePayload = await onUploadImage(file);
      setFormData((current) => ({
        ...current,
        image_url: imagePayload?.image_url || current.image_url,
        image_path: imagePayload?.image_path || current.image_path,
      }));
      setImageFile(null);
      clearFileInput();
      setUploadMessage(
        imagePayload?.reused
          ? 'Esta imagem ja estava na biblioteca. Ela foi reutilizada.'
          : 'Imagem enviada para a biblioteca.',
      );
    } catch (uploadError) {
      setError(uploadError.message || 'Nao foi possivel enviar a imagem.');
      setFieldErrors((current) => ({
        ...current,
        image: uploadError.message || 'Nao foi possivel enviar a imagem.',
      }));
      setUploadMessage('');
      setImageFile(null);
      clearFileInput();
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function openImageLibrary() {
    setIsLibraryOpen(true);
    setLibraryError('');
    setIsLoadingLibrary(true);

    try {
      const images = await onListImages();
      setLibraryImages(images);
    } catch (loadError) {
      setLibraryError(loadError.message || 'Nao foi possivel carregar a biblioteca de imagens.');
    } finally {
      setIsLoadingLibrary(false);
    }
  }

  function closeImageLibrary() {
    setIsLibraryOpen(false);
  }

  function selectLibraryImage(image) {
    setFormData((current) => ({
      ...current,
      image_url: image.url,
      image_path: image.path,
    }));
    setImageFile(null);
    setFieldErrors((current) => ({ ...current, image: '' }));
    setUploadMessage('Imagem selecionada da biblioteca.');
    clearFileInput();
    closeImageLibrary();
  }

  function validateForm(status) {
    const errors = {};
    const trimmedDescription = formData.description.trim();

    if (!formData.title.trim()) {
      errors.title = 'Informe um titulo para o post.';
    }

    if (!formData.slug.trim()) {
      errors.slug = 'Informe um slug para o artigo.';
    }

    if (!formData.category) {
      errors.category = 'Selecione uma categoria.';
    }

    if (!trimmedDescription) {
      errors.description = 'Informe uma descricao curta para o post.';
    } else if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
      errors.description = `A descricao precisa ter pelo menos ${MIN_DESCRIPTION_LENGTH} caracteres.`;
    }

    if (formData.published_at && Number.isNaN(new Date(formData.published_at).getTime())) {
      errors.published_at = 'Informe uma data valida.';
    }

    if (status === 'active' && !formData.image_url && !imageFile) {
      errors.image = 'Envie uma imagem para publicar este conteudo.';
    }

    if (status === 'active' && !formData.content.trim()) {
      errors.content = 'Informe o texto completo antes de publicar.';
    }

    return errors;
  }

  async function submitPost(statusOverride) {
    setError('');
    setFieldErrors({});

    const status = statusOverride || formData.status;
    const validationErrors = validateForm(status);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('Revise os campos destacados antes de continuar.');
      return;
    }

    try {
      let imagePayload = {};

      if (imageFile) {
        setUploadMessage('Enviando imagem...');
        imagePayload = await onUploadImage(imageFile);
        setUploadMessage(
          imagePayload?.reused
            ? 'Esta imagem ja estava na biblioteca. Ela foi reutilizada.'
            : 'Imagem enviada para a biblioteca.',
        );
      }

      await onSave({
        ...formData,
        ...imagePayload,
        status,
        published_at: fromDatetimeLocal(formData.published_at),
      });

      resetLocalForm();
      onResetComplete?.();
    } catch (saveError) {
      setError(saveError.message || 'Nao foi possivel salvar o post.');
      setUploadMessage('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitPost();
  }

  async function handleSaveDraft() {
    updateField('status', 'inactive');
    await submitPost('inactive');
  }

  return (
    <section className="admin-editor" aria-labelledby="admin-editor-title">
      <div className="admin-editor-heading">
        <p className="admin-kicker">{isEditing ? 'Edicao' : 'Novo conteudo'}</p>
        <h2 id="admin-editor-title">{isEditing ? 'Editar post' : 'Criar post'}</h2>
      </div>

      <form className="admin-form admin-editor-form" onSubmit={handleSubmit}>
        <label data-tour="title">
          <FieldTitle>Titulo</FieldTitle>
          <input
            type="text"
            maxLength="120"
            value={formData.title}
            onChange={(event) => updateField('title', event.target.value)}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'admin-title-error' : undefined}
            required
          />
          {fieldErrors.title && (
            <span className="admin-field-error" id="admin-title-error">
              {fieldErrors.title}
            </span>
          )}
        </label>

        <label>
          <FieldTitle tooltip="Endereço do artigo na internet. Exemplo: /revista/como-usar-alfaiataria">
            Slug
          </FieldTitle>
          <input
            type="text"
            maxLength="140"
            value={formData.slug}
            onChange={(event) => updateField('slug', slugify(event.target.value))}
            aria-invalid={Boolean(fieldErrors.slug)}
            aria-describedby={fieldErrors.slug ? 'admin-slug-error' : undefined}
            required
          />
          {fieldErrors.slug && (
            <span className="admin-field-error" id="admin-slug-error">
              {fieldErrors.slug}
            </span>
          )}
        </label>

        <div className="admin-form-grid">
          <label data-tour="category">
            <FieldTitle tooltip="Utilizada para organização e recomendação de conteúdos.">Categoria</FieldTitle>
            <select
              value={formData.category}
              onChange={(event) => updateField('category', event.target.value)}
              aria-invalid={Boolean(fieldErrors.category)}
              aria-describedby={fieldErrors.category ? 'admin-category-error' : undefined}
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <span className="admin-field-error" id="admin-category-error">
                {fieldErrors.category}
              </span>
            )}
          </label>

          <label>
            <FieldTitle tooltip="Conteúdos publicados ficam visíveis ao público.">Status</FieldTitle>
            <select value={formData.status} onChange={(event) => updateField('status', event.target.value)} required>
              <option value="inactive">Rascunho</option>
              <option value="active">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
        </div>

        <label>
          <FieldTitle>Descricao curta</FieldTitle>
          <textarea
            maxLength="240"
            rows="4"
            value={formData.description}
            onChange={(event) => updateField('description', event.target.value)}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? 'admin-description-error' : undefined}
            required
          />
          {fieldErrors.description && (
            <span className="admin-field-error" id="admin-description-error">
              {fieldErrors.description}
            </span>
          )}
        </label>

        <label data-tour="content">
          <FieldTitle>Texto completo do artigo</FieldTitle>
          <textarea
            className="admin-content-textarea"
            rows="10"
            value={formData.content}
            onChange={(event) => updateField('content', event.target.value)}
            aria-invalid={Boolean(fieldErrors.content)}
            aria-describedby={fieldErrors.content ? 'admin-content-error' : undefined}
            placeholder="Escreva o artigo completo aqui."
          />
          {fieldErrors.content && (
            <span className="admin-field-error" id="admin-content-error">
              {fieldErrors.content}
            </span>
          )}
        </label>

        <label>
          <FieldTitle tooltip="Conteúdos publicados ficam visíveis ao público.">Data de publicacao</FieldTitle>
          <input
            type="datetime-local"
            value={formData.published_at}
            onChange={(event) => updateField('published_at', event.target.value)}
            aria-invalid={Boolean(fieldErrors.published_at)}
            aria-describedby={fieldErrors.published_at ? 'admin-published-at-error' : undefined}
          />
          {fieldErrors.published_at && (
            <span className="admin-field-error" id="admin-published-at-error">
              {fieldErrors.published_at}
            </span>
          )}
        </label>

        <div className="admin-image-tools" data-tour="image">
          <div className="admin-image-tools-header">
            <FieldTitle tooltip="Imagem principal utilizada na Revista e compartilhamentos.">Imagem do post</FieldTitle>
            <button className="admin-inline-link" type="button" onClick={openImageLibrary}>
              Escolher da biblioteca
            </button>
          </div>
          <label className="admin-upload-drop">
            <span>Enviar imagem</span>
            <small>WebP, JPG ou PNG ate 4 MB.</small>
            <input
              type="file"
              accept="image/webp,image/jpeg,image/png"
              onChange={handleImageChange}
              ref={fileInputRef}
              aria-invalid={Boolean(fieldErrors.image)}
              aria-describedby={fieldErrors.image ? 'admin-image-error' : undefined}
              disabled={isUploadingImage}
            />
          </label>
          {fieldErrors.image && (
            <span className="admin-field-error" id="admin-image-error">
              {fieldErrors.image}
            </span>
          )}
        </div>

        <details className="admin-advanced-url">
          <summary>URL manual da imagem</summary>
          <label>
            <FieldTitle tooltip="Campo avancado para reaproveitar uma URL publica existente.">URL da imagem</FieldTitle>
            <input
              type="url"
              value={formData.image_url}
              onChange={(event) => updateField('image_url', event.target.value)}
              placeholder="https://..."
            />
          </label>
        </details>

        {previewImage && (
          <div className="admin-image-preview">
            <img src={previewImage} alt="Previa da imagem do post" />
          </div>
        )}

        <aside className="admin-card-preview" aria-label="Pre-visualizacao do card da Revista">
          <div className="admin-card-preview-media">
            {previewImage ? <img src={previewImage} alt="Previa editorial do post" /> : <span>Imagem do post</span>}
          </div>
          <div className="admin-card-preview-content">
            <p>{formData.category || 'Categoria'}</p>
            <h3>{formData.title || 'Titulo do post'}</h3>
            <span>{formData.description || 'A descricao curta aparece aqui antes da publicacao.'}</span>
          </div>
        </aside>

        <aside className="admin-seo-assistant" aria-label="Assistente SEO do editorial">
          <div className="admin-seo-header">
            <div>
              <p className="admin-kicker">SEO editorial</p>
              <h3>Publicacao mais forte</h3>
            </div>
            <span className={`admin-seo-score admin-seo-score-${seoAssistant.rating.toLowerCase()}`}>
              {seoAssistant.rating}
            </span>
          </div>

          <div className="admin-seo-url">
            <span>URL final</span>
            <code>{seoAssistant.url}</code>
          </div>

          <div className="admin-seo-checklist">
            {seoAssistant.checks.map((check) => (
              <div className={`admin-seo-check ${check.isValid ? 'is-valid' : 'needs-attention'}`} key={check.key}>
                <span>{check.isValid ? 'OK' : 'Atencao'}</span>
                <div>
                  <strong>{check.label}</strong>
                  {!check.isValid && <small>{check.hint}</small>}
                </div>
              </div>
            ))}
          </div>

          <div className="admin-share-preview" aria-label="Previa de compartilhamento">
            <div className="admin-share-preview-media">
              {previewImage ? <img src={previewImage} alt="Previa de compartilhamento do post" /> : <span>Imagem</span>}
            </div>
            <div>
              <span>Previa de compartilhamento</span>
              <strong>{formData.title || 'Titulo do post'}</strong>
              <p>{formData.description || 'A descricao curta aparece aqui quando o link for compartilhado.'}</p>
            </div>
          </div>
        </aside>

        {uploadMessage && <p className="admin-upload-note">{uploadMessage}</p>}

        {error && <p className="admin-message admin-message-error">{error}</p>}

        <div className="admin-form-actions">
          <button
            className="admin-button admin-button-secondary"
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || isUploadingImage}
          >
            Salvar rascunho
          </button>
          <button
            className="admin-button admin-button-primary"
            type="submit"
            disabled={isSaving || isUploadingImage}
            data-tour="publish"
          >
            {isSaving || isUploadingImage ? 'Salvando...' : formData.status === 'active' ? 'Publicar' : 'Salvar'}
          </button>
        </div>
      </form>

      {isLibraryOpen && (
        <div className="admin-library-backdrop" role="presentation">
          <section
            className="admin-library-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-library-title"
          >
            <div className="admin-library-header">
              <div>
                <p className="admin-kicker">Biblioteca editorial</p>
                <h3 id="admin-library-title">Imagens da Revista</h3>
              </div>
              <button className="admin-button admin-button-secondary" type="button" onClick={closeImageLibrary}>
                Fechar
              </button>
            </div>

            <div className="admin-library-body">
              {isLoadingLibrary ? (
                <p className="admin-empty">Carregando imagens...</p>
              ) : libraryError ? (
                <p className="admin-message admin-message-error">{libraryError}</p>
              ) : libraryImages.length ? (
                <>
                  <div className="admin-library-toolbar">
                    <label>
                      <span>Buscar imagem</span>
                      <input
                        type="search"
                        value={librarySearch}
                        onChange={(event) => setLibrarySearch(event.target.value)}
                        placeholder="Nome ou data"
                      />
                    </label>

                    <div className="admin-library-controls" aria-label="Filtros da biblioteca">
                      <button
                        type="button"
                        className={libraryFilter === 'all' ? 'is-active' : ''}
                        onClick={() => setLibraryFilter('all')}
                      >
                        Todas
                      </button>
                      <button
                        type="button"
                        className={librarySort === 'newest' ? 'is-active' : ''}
                        onClick={() => setLibrarySort('newest')}
                      >
                        Mais recentes
                      </button>
                      <button
                        type="button"
                        className={librarySort === 'oldest' ? 'is-active' : ''}
                        onClick={() => setLibrarySort('oldest')}
                      >
                        Mais antigas
                      </button>
                      {['webp', 'jpg', 'png'].map((extension) => (
                        <button
                          type="button"
                          className={libraryFilter === extension ? 'is-active' : ''}
                          onClick={() => setLibraryFilter(extension)}
                          key={extension}
                        >
                          {extension.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <p className="admin-library-counter">
                      {librarySearch.trim() || libraryFilter !== 'all'
                        ? `${visibleLibraryImages.length} resultados encontrados`
                        : `${libraryImages.length} imagens na biblioteca`}
                    </p>
                  </div>

                  {visibleLibraryImages.length ? (
                    <div className="admin-library-grid">
                      {visibleLibraryImages.map((image) => {
                        const isSelected = formData.image_path === image.path || formData.image_url === image.url;

                        return (
                          <article
                            className={`admin-library-item ${isSelected ? 'is-selected' : ''}`}
                            key={image.path}
                          >
                            <div className="admin-library-thumb">
                              <img src={image.url} alt={`Imagem da biblioteca: ${getFriendlyImageName(image.name)}`} loading="lazy" />
                            </div>
                            <div className="admin-library-info">
                              <strong title={image.name}>{getFriendlyImageName(image.name)}</strong>
                              <small>{formatLibraryDate(image.createdAt)}</small>
                              {isSelected && <span className="admin-library-selected">Selecionada</span>}
                              <button
                                className="admin-button admin-button-primary"
                                type="button"
                                onClick={() => selectLibraryImage(image)}
                              >
                                Usar esta imagem
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="admin-empty">Nenhuma imagem encontrada para esta busca.</p>
                  )}
                </>
              ) : (
                <div className="admin-library-empty">
                  <p>Nenhuma imagem enviada ainda.</p>
                  <span>Envie a primeira imagem pelo formulario do post.</span>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default AdminPostForm;
