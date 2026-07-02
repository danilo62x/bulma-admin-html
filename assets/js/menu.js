/**
 * Menu structure. Same shape across all template frameworks.
 */
window.txMenu = {
  items: [
    { label: 'Dashboard', icon: 'mdi-view-dashboard', href: 'dashboard.html' },
    { label: 'Analytics', icon: 'mdi-chart-areaspline', href: 'charts.html' },
    {
      label: 'Interface',
      icon: 'mdi-puzzle',
      children: [
        {
          label: 'Componentes',
          icon: 'mdi-widgets-outline',
          children: [
            { label: 'Geral', icon: 'mdi-view-grid-outline', href: 'components.html' },
            { label: 'Avançados', icon: 'mdi-cards-outline', href: 'ui-advanced.html' },
            { label: 'Tipografia', icon: 'mdi-format-font', href: 'typography.html' },
          ],
        },
        {
          label: 'Dados',
          icon: 'mdi-database-outline',
          children: [
            { label: 'Formulários', icon: 'mdi-form-select', href: 'forms.html' },
            { label: 'Tabelas', icon: 'mdi-table', href: 'tables.html' },
          ],
        },
      ],
    },
    {
      label: 'Aplicações',
      icon: 'mdi-apps',
      children: [
        { label: 'Caixa de entrada', icon: 'mdi-email-outline', href: 'inbox.html' },
        { label: 'Arquivos', icon: 'mdi-folder-outline', href: 'file-manager.html' },
        { label: 'Galeria', icon: 'mdi-image-multiple-outline', href: 'gallery.html' },
        { label: 'Fatura', icon: 'mdi-receipt-text-outline', href: 'invoice.html' },
        { label: 'Cobrança', icon: 'mdi-credit-card-outline', href: 'billing.html' },
      ],
    },
    {
      label: 'Integrações',
      icon: 'mdi-flash',
      href: 'integrations.html',
    },
    {
      label: 'Páginas',
      icon: 'mdi-file-multiple-outline',
      children: [
        { label: 'Perfil', icon: 'mdi-account-circle', href: 'profile.html' },
        { label: 'Planos & Preços', icon: 'mdi-tag-multiple', href: 'pricing.html' },
        { label: 'Documentação', icon: 'mdi-book-open-page-variant-outline', href: 'documentation.html' },
        { label: 'Landing page', icon: 'mdi-monitor-dashboard', href: 'index.html' },
      ],
    },
    {
      label: 'Páginas utilitárias',
      icon: 'mdi-toolbox-outline',
      children: [
        { label: 'Em breve', icon: 'mdi-rocket-launch-outline', href: 'coming-soon.html' },
        { label: 'Manutenção', icon: 'mdi-cog-outline', href: 'maintenance.html' },
        { label: 'Erro 404', icon: 'mdi-alert-circle-outline', href: 'not-found.html' },
        { label: 'Criar conta', icon: 'mdi-account-plus-outline', href: 'register.html' },
        { label: 'Esqueci a senha', icon: 'mdi-lock-question', href: 'forgot-password.html' },
        { label: 'Redefinir senha', icon: 'mdi-lock-reset', href: 'reset-password.html' },
      ],
    },
    { label: 'Configurações', icon: 'mdi-cog', href: 'settings.html' },
  ],
  footerItems: [
    { label: 'Sair', icon: 'mdi-logout', action: 'logout' },
  ],
};
