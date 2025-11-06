(() => {
  /**
   * ============================================
   * 🚀 PABX Layout Optimizer
   * Autor: israel elias
   * Versão: 1.0
   * Compatível com: Edge / Chrome / Firefox
   * ============================================
   * 
   * FUNCIONALIDADES:
   * - Simplifica interface de atendimento PABX
   * - Sistema de toggle (alternar entre estados)
   * - Atalho Ctrl+Q para alternar
   * - Preservação completa do estado original
   */

  /** --------------------------
   * ⚙️ CONFIGURAÇÕES GERAIS
   * ---------------------------*/
  const config = {
    // Atalho de teclado (Ctrl+Q)
    keyboard: {
      ctrl: true,
      alt: false,
      shift: false,
      key: 'Q'
    },

    // CSS customizado que será injetado
    customCSS: `
      /* Elemento 04: Aumentar botão Finalizar */
      #qualifi_return {
        padding: 12px 24px !important;
        font-size: 16px !important;
        min-height: 45px !important;
      }
      
      #qualifi_return i {
        font-size: 18px !important;
      }
    `
  };

  /** --------------------------
   * 💾 ARMAZENAMENTO DE ESTADO
   * ---------------------------*/
  const state = {
    isModified: false,
    styleElement: null,
    originalState: new Map()
  };

  /** --------------------------
   * 🔧 FUNÇÕES DE UTILIDADE
   * ---------------------------*/

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  /**
   * Salva o estado original de um elemento
   */
  const saveElementState = (element, key) => {
    if (!element || state.originalState.has(key)) return;
    
    state.originalState.set(key, {
      element: element,
      innerHTML: element.innerHTML,
      display: element.style.display,
      visibility: element.style.visibility,
      attributes: {}
    });
    
    console.log(`💾 Estado salvo: ${key}`);
  };

  /**
   * Restaura o estado original de um elemento
   */
  const restoreElementState = (key) => {
    const saved = state.originalState.get(key);
    if (!saved) return false;
    
    const { element, innerHTML, display, visibility } = saved;
    
    element.innerHTML = innerHTML;
    element.style.display = display;
    element.style.visibility = visibility;
    
    console.log(`🔄 Estado restaurado: ${key}`);
    return true;
  };

  /**
   * Injeta CSS customizado no head
   */
  const injectCustomCSS = () => {
    const styleId = 'pabx-optimizer-styles';
    
    const existingStyle = $(`#${styleId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = config.customCSS.trim();
    document.head.appendChild(style);
    state.styleElement = style;
    console.log('🎨 CSS personalizado injetado.');
  };

  /**
   * Remove CSS customizado
   */
  const removeCustomCSS = () => {
    if (state.styleElement) {
      state.styleElement.remove();
      state.styleElement = null;
      console.log('🎨 CSS personalizado removido.');
    }
  };

  /** --------------------------
   * 🎯 MODIFICAÇÕES DOS ELEMENTOS
   * ---------------------------*/

  /**
   * ELEMENTO 01: Simplifica informações de atendimento
   * Mostra apenas o número de contato
   */
  const modifyElement01 = () => {
    const container = $('.jojo-float-r');
    if (!container) {
      console.warn('⚠️ Elemento 01 não encontrado');
      return false;
    }

    const small = container.querySelector('small.pull-right.noline');
    if (!small) return false;

    saveElementState(small, 'element01');

    // Pega apenas o número de telefone
    const telSpan = small.querySelector('#tel-atende');
    if (telSpan) {
      const phoneNumber = telSpan.textContent;
      small.innerHTML = `<b><span id="tel-atende">${phoneNumber}</span></b>`;
      console.log('✅ Elemento 01 simplificado');
      return true;
    }

    return false;
  };

  /**
   * ELEMENTO 03: Oculta botão "Finalizar atendimento"
   */
  const modifyElement03 = () => {
    const endContactBox = $('#end_contact_box');
    if (!endContactBox) {
      console.warn('⚠️ Elemento 03 não encontrado');
      return false;
    }

    saveElementState(endContactBox, 'element03');

    endContactBox.style.display = 'none';
    console.log('✅ Elemento 03 ocultado');
    return true;
  };

  /**
   * ELEMENTO 05: Simplifica visualização de chamadas em espera
   * Mostra apenas o número
   */
  const modifyElement05 = () => {
    const divWaitCalls = $('#div_wait_calls');
    if (!divWaitCalls) {
      console.warn('⚠️ Elemento 05 não encontrado');
      return false;
    }

    const badgeSpan = divWaitCalls.querySelector('span.badge-nav.alert-popup.wait_call');
    if (!badgeSpan) return false;

    saveElementState(badgeSpan, 'element05');

    // Pega apenas o número
    const numSpan = badgeSpan.querySelector('#wait_calls_num');
    if (numSpan) {
      const waitNumber = numSpan.outerHTML;
      badgeSpan.innerHTML = `<b>${waitNumber}</b>`;
      console.log('✅ Elemento 05 simplificado');
      return true;
    }

    return false;
  };

  /**
   * Aplica todas as modificações
   */
  const applyModifications = () => {
    console.log('🔧 Aplicando modificações...');
    
    let success = true;
    success = modifyElement01() && success;
    success = modifyElement03() && success;
    success = modifyElement05() && success;
    
    injectCustomCSS();
    
    if (success) {
      console.log('✅ Modificações aplicadas com sucesso');
    } else {
      console.warn('⚠️ Algumas modificações falharam');
    }
    
    return success;
  };

  /**
   * Restaura todas as modificações
   */
  const restoreModifications = () => {
    console.log('🔄 Restaurando estado original...');
    
    restoreElementState('element01');
    restoreElementState('element03');
    restoreElementState('element05');
    
    removeCustomCSS();
    
    console.log('✅ Estado original restaurado');
  };

  /**
   * Alterna entre estado original e modificado
   */
  const toggleLayout = () => {
    if (state.isModified) {
      // Retorna ao estado original
      restoreModifications();
      state.isModified = false;
      console.log('🔙 Layout voltou ao estado original');
      
      // Notifica usuário
      showNotification('Layout Original Restaurado', 'success');
    } else {
      // Aplica modificações
      const success = applyModifications();
      if (success) {
        state.isModified = true;
        console.log('✨ Layout otimizado aplicado');
        
        // Notifica usuário
        showNotification('Layout Otimizado Aplicado', 'info');
      }
    }
  };

  /**
   * Mostra notificação visual para o usuário
   */
  const showNotification = (message, type = 'info') => {
    // Usa o sistema de notificação nativo da página se disponível
    if (typeof userAlert === 'function') {
      userAlert(type, message, 2000, true);
    } else {
      console.log(`📢 ${message}`);
    }
  };

  /**
   * Configura o atalho de teclado
   */
  const setupKeyboardShortcut = () => {
    const { ctrl, alt, shift, key } = config.keyboard;
    
    const modifiers = [];
    if (ctrl) modifiers.push('Ctrl');
    if (alt) modifiers.push('Alt');
    if (shift) modifiers.push('Shift');
    const shortcut = [...modifiers, key].join('+');
    
    console.log(`⌨️ Atalho configurado: ${shortcut}`);

    document.addEventListener('keydown', (e) => {
      const ctrlMatch = ctrl ? e.ctrlKey : !e.ctrlKey;
      const altMatch = alt ? e.altKey : !e.altKey;
      const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
      const keyMatch = e.key.toUpperCase() === key.toUpperCase();

      if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
        e.preventDefault();
        console.log(`⌨️ Atalho ${shortcut} pressionado!`);
        toggleLayout();
      }
    });
  };

  /**
   * Aguarda o carregamento completo da página
   */
  const waitForPageLoad = () => {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
  };

  /** --------------------------
   * 🧠 EXECUÇÃO PRINCIPAL
   * ---------------------------*/
  const main = async () => {
    console.log('🚀 Iniciando PABX Layout Optimizer v1.0...');
    console.log('📦 Configurações:', {
      keyboard: `${config.keyboard.ctrl ? 'Ctrl+' : ''}${config.keyboard.alt ? 'Alt+' : ''}${config.keyboard.shift ? 'Shift+' : ''}${config.keyboard.key}`
    });

    // Aguarda carregamento completo
    await waitForPageLoad();
    console.log('✅ Página carregada');

    // Aguarda mais um momento para garantir que elementos dinâmicos estejam prontos
    setTimeout(() => {
      // Configura atalho de teclado
      setupKeyboardShortcut();

      // Aplica modificações inicialmente
      toggleLayout();

      console.log('✨ Script carregado com sucesso!');
      console.log('💡 Dica: Pressione Ctrl+Q para alternar entre layouts');
    }, 1000);
  };

  /** --------------------------
   * 🌐 API GLOBAL (OPCIONAL)
   * ---------------------------*/
  window.togglePabxLayout = toggleLayout;
  window.pabxLayoutState = () => ({
    isModified: state.isModified,
    keyboard: config.keyboard,
    savedElements: Array.from(state.originalState.keys())
  });

  /** --------------------------
   * 🚀 INICIALIZAÇÃO
   * ---------------------------*/
  try {
    main();
  } catch (err) {
    console.error('⚠️ Erro ao executar o script:', err);
  }
})();
