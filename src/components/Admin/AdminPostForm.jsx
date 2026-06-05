import { useEffect, useMemo, useRef, useState } from 'react';
import { magazineCategories } from '../Magazine/magazineFallback.js';
import { slugify } from '../../utils/slugify.js';

const CATEGORIES = magazineCategories.filter((category) => category !== 'Todos');
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MIN_DESCRIPTION_LENGTH = 10;

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

function AdminPostForm({ post, isSaving, onSave, onUploadImage, onResetComplete }) {
  const [formData, setFormData] = useState(emptyPost);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadMessage, setUploadMessage] = useState('');
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
    clearFileInput();
  }, [post]);

  const previewImage = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return formData.image_url;
  }, [formData.image_url, imageFile]);

  useEffect(
    () => () => {
      if (previewImage?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    },
    [previewImage],
  );

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

  function handleImageChange(event) {
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
    setUploadMessage('Imagem pronta para envio ao salvar.');
    setImageFile(file);
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
        setUploadMessage('Imagem enviada com sucesso.');
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
        <label>
          Titulo
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
          Slug
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
          <label>
            Categoria
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
            Status
            <select value={formData.status} onChange={(event) => updateField('status', event.target.value)} required>
              <option value="inactive">Rascunho</option>
              <option value="active">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
        </div>

        <label>
          Descricao curta
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

        <label>
          Texto completo do artigo
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
          Data de publicacao
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

        <label>
          Imagem do post
          <input
            type="file"
            accept="image/webp,image/jpeg,image/png"
            onChange={handleImageChange}
            ref={fileInputRef}
            aria-invalid={Boolean(fieldErrors.image)}
            aria-describedby={fieldErrors.image ? 'admin-image-error' : undefined}
          />
          {fieldErrors.image && (
            <span className="admin-field-error" id="admin-image-error">
              {fieldErrors.image}
            </span>
          )}
        </label>

        <label>
          URL da imagem
          <input
            type="url"
            value={formData.image_url}
            onChange={(event) => updateField('image_url', event.target.value)}
            placeholder="https://..."
          />
        </label>

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

        {uploadMessage && <p className="admin-upload-note">{uploadMessage}</p>}

        {error && <p className="admin-message admin-message-error">{error}</p>}

        <div className="admin-form-actions">
          <button
            className="admin-button admin-button-secondary"
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            Salvar rascunho
          </button>
          <button className="admin-button admin-button-primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : formData.status === 'active' ? 'Publicar' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminPostForm;
