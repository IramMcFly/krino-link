// Estilos consistentes para todos los módulos de diagnóstico

export const moduleStyles = {
  // Contenedor principal del módulo
  container: "min-h-screen bg-gradient-to-br from-[#1b1f20] via-[#2a2a2a] to-[#1b1f20] text-white p-4",
  
  // Header del módulo
  header: {
    container: "bg-gradient-to-r from-[#2e2e2e] to-[#3a3a3a] rounded-xl p-6 mb-6 shadow-lg",
    title: "text-2xl font-bold mb-2",
    subtitle: "text-gray-300 mb-4",
    statusBadge: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
    statusActive: "bg-green-500/20 text-green-300 border border-green-500/30",
    statusInactive: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
    statusWarning: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    statusError: "bg-red-500/20 text-red-300 border border-red-500/30"
  },
  
  // Botones principales
  buttons: {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
  },
  
  // Tarjetas de información
  cards: {
    primary: "bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 shadow-lg border border-gray-700/50",
    info: "bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 shadow-lg border border-gray-600/50",
    success: "bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 shadow-lg border border-gray-600/50",
    warning: "bg-gradient-to-br from-[#3a2a1a] to-[#332211] rounded-xl p-6 shadow-lg border border-yellow-600/30",
    danger: "bg-gradient-to-br from-[#3a1a1a] to-[#331111] rounded-xl p-6 shadow-lg border border-red-600/30"
  },
  
  // Grid de parámetros
  parameterGrid: {
    container: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6",
    item: "bg-gradient-to-br from-[#2a2a2a] to-[#323232] p-4 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200",
    label: "text-sm font-medium text-gray-300 mb-1",
    value: "text-lg font-bold text-white",
    unit: "text-sm text-gray-400 ml-1",
    trend: {
      up: "text-green-400",
      down: "text-red-400",
      stable: "text-gray-400"
    }
  },
  
  // Alertas
  alerts: {
    container: "space-y-2 mb-6",
    error: "flex items-center gap-3 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-600/50 rounded-lg",
    warning: "flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600/50 rounded-lg",
    info: "flex items-center gap-3 p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-600/50 rounded-lg",
    success: "flex items-center gap-3 p-4 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-600/50 rounded-lg"
  },
  
  // Gráficos
  charts: {
    container: "bg-gradient-to-br from-[#2a2a2a] to-[#323232] rounded-xl p-6 shadow-lg border border-gray-700/50",
    title: "text-lg font-semibold mb-4 text-center",
    wrapper: "h-64 w-full"
  },
  
  // Controles de modo
  modeControls: {
    container: "flex flex-wrap gap-3 mb-6",
    button: "px-4 py-2 rounded-lg font-medium transition-all duration-200 border",
    active: "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg",
    inactive: "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
  },
  
  // Layouts responsivos
  layout: {
    twoColumn: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    threeColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    fullWidth: "w-full",
    centered: "max-w-4xl mx-auto"
  },
  
  // Estados de diagnóstico
  diagnosticStatus: {
    idle: "bg-gray-500/20 text-gray-300",
    running: "bg-blue-500/20 text-blue-300 animate-pulse",
    complete: "bg-green-500/20 text-green-300",
    error: "bg-red-500/20 text-red-300"
  }
};

// Utilidades para clases condicionales
export const getStatusClass = (status) => {
  const statusMap = {
    active: moduleStyles.header.statusActive,
    inactive: moduleStyles.header.statusInactive,
    warning: moduleStyles.header.statusWarning,
    error: moduleStyles.header.statusError
  };
  return statusMap[status] || moduleStyles.header.statusInactive;
};

export const getAlertClass = (type) => {
  const alertMap = {
    error: moduleStyles.alerts.error,
    warning: moduleStyles.alerts.warning,
    info: moduleStyles.alerts.info,
    success: moduleStyles.alerts.success
  };
  return alertMap[type] || moduleStyles.alerts.info;
};

export const getTrendClass = (trend) => {
  const trendMap = {
    up: moduleStyles.parameterGrid.trend.up,
    down: moduleStyles.parameterGrid.trend.down,
    stable: moduleStyles.parameterGrid.trend.stable
  };
  return trendMap[trend] || moduleStyles.parameterGrid.trend.stable;
};

// Componentes reutilizables con estilos consistentes
export const ModuleHeader = ({ title, subtitle, status, statusText, children }) => (
  <div className={moduleStyles.header.container}>
    <h1 className={moduleStyles.header.title}>{title}</h1>
    {subtitle && <p className={moduleStyles.header.subtitle}>{subtitle}</p>}
    {status && (
      <div className={`${moduleStyles.header.statusBadge} ${getStatusClass(status)}`}>
        {statusText || status}
      </div>
    )}
    {children}
  </div>
);

export const ParameterCard = ({ label, value, unit, trend, className }) => (
  <div className={`${moduleStyles.parameterGrid.item} ${className || ''}`}>
    <div className={moduleStyles.parameterGrid.label}>{label}</div>
    <div className="flex items-baseline">
      <span className={moduleStyles.parameterGrid.value}>{value}</span>
      {unit && <span className={moduleStyles.parameterGrid.unit}>{unit}</span>}
      {trend && <span className={getTrendClass(trend)}> {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>}
    </div>
  </div>
);

export const AlertBanner = ({ type, message, icon: Icon }) => (
  <div className={getAlertClass(type)}>
    {Icon && <Icon size={20} />}
    <span>{message}</span>
  </div>
);

export const ChartContainer = ({ title, children }) => (
  <div className={moduleStyles.charts.container}>
    {title && <h3 className={moduleStyles.charts.title}>{title}</h3>}
    <div className={moduleStyles.charts.wrapper}>
      {children}
    </div>
  </div>
);

// Exportación por defecto con todos los componentes
const ModuleStyles = {
  Header: ({ children, className = "" }) => (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      {children}
    </div>
  ),
  
  InfoCard: ({ title, icon: Icon, children, className = "" }) => (
    <div className={`${moduleStyles.cards.info} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="text-blue-400" size={20} />}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  ),
  
  SuccessCard: ({ title, icon: Icon, children, className = "" }) => (
    <div className={`${moduleStyles.cards.success} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="text-green-400" size={20} />}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  ),
  
  WarningCard: ({ title, icon: Icon, children, className = "" }) => (
    <div className={`${moduleStyles.cards.warning} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="text-yellow-400" size={20} />}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  ),
  
  DangerCard: ({ title, icon: Icon, children, className = "" }) => (
    <div className={`${moduleStyles.cards.danger} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="text-red-400" size={20} />}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  ),
  
  ChartCard: ({ title, icon: Icon, children, className = "" }) => (
    <div className={`${moduleStyles.charts.container} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="text-blue-400" size={20} />}
          {title && <h3 className={moduleStyles.charts.title}>{title}</h3>}
        </div>
      )}
      <div className={moduleStyles.charts.wrapper}>
        {children}
      </div>
    </div>
  ),
  
  // Mantener compatibilidad con componentes existentes
  ModuleHeader,
  ParameterCard,
  AlertBanner,
  ChartContainer,
  
  // Exportar también los estilos
  styles: moduleStyles,
  getStatusClass,
  getAlertClass,
  getTrendClass
};

export default ModuleStyles;
