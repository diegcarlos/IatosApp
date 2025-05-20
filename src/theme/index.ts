export const colors = {
  // Cores principais
  primary: {
    main: "#2C5282", // Azul profissional
    light: "#4299E1",
    dark: "#1A365D",
  },
  secondary: {
    main: "#38A169", // Verde suave para elementos secundários
    light: "#48BB78",
    dark: "#2F855A",
  },
  // Cores de fundo
  background: {
    default: "#FFFFFF",
    paper: "#F7FAFC",
    dark: "#EDF2F7",
  },
  // Cores de texto
  text: {
    primary: "#1A202C",
    secondary: "#4A5568",
    disabled: "#A0AEC0",
  },
  // Cores de status
  status: {
    success: "#38A169",
    error: "#E53E3E",
    warning: "#DD6B20",
    info: "#3182CE",
  },
  // Cores para o desenho da área
  drawing: {
    stroke: "rgba(44, 82, 130, 0.3)", // Azul profissional com transparência
    fill: "rgba(44, 82, 130, 0.1)",
    point: "rgba(44, 82, 130, 0.5)",
  },
};

export const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
