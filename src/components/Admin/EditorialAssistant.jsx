import { useEffect, useMemo, useRef, useState } from 'react';

const TOUR_DISMISSED_KEY = 'editorial-tour-dismissed';

const tourSteps = [
  {
    target: '[data-tour="new-content"]',
    title: 'Novo conteúdo',
    message: 'Aqui você cria novos editoriais para a Revista. Clique em continuar.',
  },
  {
    target: '[data-tour="title"]',
    title: 'Título',
    message: 'O título será exibido na Revista e utilizado na URL do artigo.',
  },
  {
    target: '[data-tour="category"]',
    title: 'Categoria',
    message: 'Categorias ajudam a organizar os conteúdos e sugerir artigos relacionados.',
  },
  {
    target: '[data-tour="image"]',
    title: 'Imagem',
    message: 'A imagem é utilizada no destaque editorial e nos compartilhamentos.',
  },
  {
    target: '[data-tour="content"]',
    title: 'Conteúdo',
    message: 'Aqui você escreve o conteúdo completo do artigo.',
  },
  {
    target: '[data-tour="publish"]',
    title: 'Publicar',
    message: 'Quando estiver pronto, publique o conteúdo para torná-lo visível na Revista.',
  },
  {
    target: '[data-tour="dashboard"]',
    title: 'Dashboard',
    message: 'Aqui você acompanha seus conteúdos publicados, rascunhos e arquivados.',
  },
  {
    target: '[data-tour="newsletter"]',
    title: 'Newsletter',
    message: 'Os inscritos da Newsletter formam sua audiência própria.',
  },
];

const emptyRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
};

const cardEstimatedHeight = 240;
const viewportMargin = 18;

function getPrefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getBoundedValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function scrollToTarget(target) {
  const rect = target.getBoundingClientRect();
  const isMobile = window.innerWidth <= 640;
  const bottomSheetSpace = isMobile ? Math.min(window.innerHeight * 0.44, 300) : 0;
  const usableHeight = Math.max(window.innerHeight - bottomSheetSpace, 280);
  const targetTop = window.scrollY + rect.top - (usableHeight - rect.height) / 2 - (isMobile ? 12 : 0);
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  window.scrollTo({
    top: getBoundedValue(targetTop, 0, Math.max(maxScroll, 0)),
    behavior: getPrefersReducedMotion() ? 'auto' : 'smooth',
  });
}

function getHighlightStyle(rect) {
  if (!rect.width || !rect.height) {
    return {};
  }

  const margin = window.innerWidth <= 640 ? 6 : 10;

  return {
    height: `${rect.height + margin * 2}px`,
    left: `${Math.max(rect.left - margin, viewportMargin / 2)}px`,
    top: `${Math.max(rect.top - margin, viewportMargin / 2)}px`,
    width: `${Math.min(rect.width + margin * 2, window.innerWidth - viewportMargin)}px`,
  };
}

function getCardStyle(rect) {
  if (!rect.width || !rect.height) {
    return {};
  }

  const isMobile = window.innerWidth <= 640;
  const cardWidth = Math.min(isMobile ? 360 : 360, window.innerWidth - viewportMargin * 2);

  if (isMobile) {
    return {
      bottom: 'calc(12px + env(safe-area-inset-bottom))',
      left: '12px',
      maxHeight: 'calc(100dvh - 32px)',
      maxWidth: `${cardWidth}px`,
      right: '12px',
    };
  }

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceRight = window.innerWidth - rect.right;
  const hasRoomRight = spaceRight >= cardWidth + viewportMargin * 2;
  const shouldPlaceAbove = spaceBelow < cardEstimatedHeight + viewportMargin && rect.top > cardEstimatedHeight;
  const rawTop = shouldPlaceAbove ? rect.top - cardEstimatedHeight - 14 : rect.bottom + 16;
  const top = getBoundedValue(rawTop, viewportMargin, window.innerHeight - cardEstimatedHeight - viewportMargin);
  const rawLeft = hasRoomRight ? rect.right + 18 : rect.left;
  const left = getBoundedValue(rawLeft, viewportMargin, window.innerWidth - cardWidth - viewportMargin);

  return {
    left: `${left}px`,
    maxHeight: `calc(100vh - ${viewportMargin * 2}px)`,
    maxWidth: `${cardWidth}px`,
    top: `${top}px`,
  };
}

function EditorialAssistant() {
  const [isIntroOpen, setIsIntroOpen] = useState(() => window.localStorage.getItem(TOUR_DISMISSED_KEY) !== 'true');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(emptyRect);
  const [isComplete, setIsComplete] = useState(false);
  const cardRef = useRef(null);

  const currentStep = tourSteps[stepIndex];
  const highlightStyle = useMemo(() => getHighlightStyle(targetRect), [targetRect]);
  const cardStyle = useMemo(() => getCardStyle(targetRect), [targetRect]);

  function closeIntro() {
    if (doNotShowAgain) {
      window.localStorage.setItem(TOUR_DISMISSED_KEY, 'true');
    }

    setIsIntroOpen(false);
  }

  function startTour() {
    window.localStorage.removeItem(TOUR_DISMISSED_KEY);
    setIsIntroOpen(false);
    setIsComplete(false);
    setStepIndex(0);
    setIsTourOpen(true);
  }

  function closeTour() {
    setIsTourOpen(false);
    setIsComplete(false);
    setTargetRect(emptyRect);
  }

  function finishTour() {
    setIsTourOpen(false);
    setIsComplete(false);
    setTargetRect(emptyRect);
  }

  function nextStep() {
    if (stepIndex >= tourSteps.length - 1) {
      setIsComplete(true);
      setTargetRect(emptyRect);
      return;
    }

    setStepIndex((current) => current + 1);
  }

  function previousStep() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === 'Escape') {
        if (isTourOpen) {
          closeTour();
        }

        if (isIntroOpen) {
          setIsIntroOpen(false);
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isIntroOpen, isTourOpen]);

  useEffect(() => {
    if (!isTourOpen || isComplete || !currentStep?.target) {
      return undefined;
    }

    let animationFrame = 0;
    const timeoutIds = [];
    const target = document.querySelector(currentStep.target);

    function updateTargetRect() {
      if (!target) {
        setTargetRect(emptyRect);
        return;
      }

      setTargetRect(target.getBoundingClientRect());
    }

    function scheduleUpdate() {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        updateTargetRect();
        animationFrame = 0;
      });
    }

    if (target) {
      scrollToTarget(target);
    }

    updateTargetRect();
    [90, 280, 560].forEach((delay) => {
      timeoutIds.push(window.setTimeout(updateTargetRect, delay));
    });

    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentStep, isComplete, isTourOpen]);

  useEffect(() => {
    if (!isTourOpen) {
      return;
    }

    window.setTimeout(() => {
      cardRef.current?.focus({ preventScroll: true });
    }, 120);
  }, [isComplete, isTourOpen, stepIndex]);

  return (
    <>
      <button className="admin-assistant-trigger" type="button" onClick={startTour}>
        Primeiros passos
      </button>

      {isIntroOpen && (
        <div className="admin-assistant-backdrop" role="presentation">
          <section
            className="admin-assistant-modal"
            role="dialog"
            aria-labelledby="admin-assistant-intro-title"
            aria-modal="true"
          >
            <p className="admin-kicker">Assistente Editorial</p>
            <h2 id="admin-assistant-intro-title">Bem-vinda à área editorial.</h2>
            <p>Você gostaria de conhecer rapidamente como publicar, editar e gerenciar conteúdos da Revista?</p>

            <label className="admin-assistant-checkbox">
              <input
                type="checkbox"
                checked={doNotShowAgain}
                onChange={(event) => setDoNotShowAgain(event.target.checked)}
              />
              Não mostrar novamente
            </label>

            <div className="admin-assistant-actions">
              <button className="admin-button admin-button-primary" type="button" onClick={startTour}>
                Iniciar tour
              </button>
              <button className="admin-button admin-button-secondary" type="button" onClick={closeIntro}>
                Agora não
              </button>
            </div>
          </section>
        </div>
      )}

      {isTourOpen && (
        <div className="admin-assistant-layer" aria-live="polite">
          {!isComplete && targetRect.width > 0 && (
            <div className="admin-assistant-highlight" style={highlightStyle} aria-hidden="true" />
          )}

          <section
            ref={cardRef}
            className={`admin-assistant-card ${isComplete || !targetRect.width ? 'is-centered' : ''}`}
            style={!isComplete && targetRect.width ? cardStyle : undefined}
            role="dialog"
            aria-labelledby="admin-assistant-step-title"
            aria-modal="true"
            tabIndex="-1"
          >
            {isComplete ? (
              <>
                <p className="admin-kicker">Pronto</p>
                <h2 id="admin-assistant-step-title">Pronto.</h2>
                <p>Agora você já conhece os principais recursos da área editorial.</p>
                <div className="admin-assistant-actions">
                  <button className="admin-button admin-button-primary" type="button" onClick={finishTour}>
                    Começar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="admin-kicker">
                  Passo {stepIndex + 1} de {tourSteps.length}
                </p>
                <h2 id="admin-assistant-step-title">{currentStep.title}</h2>
                <p>{currentStep.message}</p>
                <div className="admin-assistant-actions">
                  <button className="admin-button admin-button-secondary" type="button" onClick={closeTour}>
                    Fechar
                  </button>
                  {stepIndex > 0 && (
                    <button className="admin-button admin-button-secondary" type="button" onClick={previousStep}>
                      Voltar
                    </button>
                  )}
                  <button className="admin-button admin-button-primary" type="button" onClick={nextStep}>
                    Continuar
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default EditorialAssistant;
