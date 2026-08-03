import type { AppIconName, IconVariantDefinition } from "./app-icon.types";

export const appIconRegistry = {
  add: {
    filled: {
      family: "ionicons",
      name: "add",
    },
  },

  back: {
    filled: {
      family: "ionicons",
      name: "chevron-back",
    },
  },

  calendar: {
    filled: {
      family: "ionicons",
      name: "calendar",
    },
    outline: {
      family: "ionicons",
      name: "calendar-outline",
    },
  },

  check: {
    filled: {
      family: "ionicons",
      name: "checkmark",
    },
  },

  "chevron-down": {
    filled: {
      family: "ionicons",
      name: "chevron-down",
    },
  },

  "chevron-right": {
    filled: {
      family: "ionicons",
      name: "chevron-forward",
    },
  },

  close: {
    filled: {
      family: "ionicons",
      name: "close",
    },
  },

  delete: {
    filled: {
      family: "material-design-icons",
      name: "trash-can",
    },
    outline: {
      family: "material-design-icons",
      name: "trash-can-outline",
    },
  },

  duration: {
    filled: {
      family: "ionicons",
      name: "time",
    },
    outline: {
      family: "ionicons",
      name: "time-outline",
    },
  },

  edit: {
    filled: {
      family: "material-design-icons",
      name: "pencil",
    },
    outline: {
      family: "material-design-icons",
      name: "pencil-outline",
    },
  },

  exercise: {
    filled: {
      family: "material-design-icons",
      name: "arm-flex",
    },
    outline: {
      family: "material-design-icons",
      name: "arm-flex-outline",
    },
  },

  filter: {
    filled: {
      family: "ionicons",
      name: "options",
    },
    outline: {
      family: "ionicons",
      name: "options-outline",
    },
  },

  history: {
    filled: {
      family: "material-design-icons",
      name: "history",
    },
  },

  home: {
    filled: {
      family: "ionicons",
      name: "home",
    },
    outline: {
      family: "ionicons",
      name: "home-outline",
    },
  },

  menu: {
    filled: {
      family: "ionicons",
      name: "menu",
    },
  },

  more: {
    filled: {
      family: "ionicons",
      name: "ellipsis-horizontal",
    },
  },

  pause: {
    filled: {
      family: "ionicons",
      name: "pause",
    },
  },

  play: {
    filled: {
      family: "ionicons",
      name: "play",
    },
  },

  profile: {
    filled: {
      family: "ionicons",
      name: "person",
    },
    outline: {
      family: "ionicons",
      name: "person-outline",
    },
  },

  progress: {
    filled: {
      family: "ionicons",
      name: "stats-chart",
    },
    outline: {
      family: "ionicons",
      name: "stats-chart-outline",
    },
  },

  reorder: {
    filled: {
      family: "material-design-icons",
      name: "drag",
    },
  },

  search: {
    filled: {
      family: "ionicons",
      name: "search",
    },
  },

  settings: {
    filled: {
      family: "ionicons",
      name: "settings",
    },
    outline: {
      family: "ionicons",
      name: "settings-outline",
    },
  },

  streak: {
    filled: {
      family: "ionicons",
      name: "flame",
    },
    outline: {
      family: "ionicons",
      name: "flame-outline",
    },
  },

  timer: {
    filled: {
      family: "ionicons",
      name: "timer",
    },
    outline: {
      family: "ionicons",
      name: "timer-outline",
    },
  },

  volume: {
    filled: {
      family: "material-design-icons",
      name: "weight-kilogram",
    },
  },

  workout: {
    filled: {
      family: "ionicons",
      name: "barbell",
    },
    outline: {
      family: "ionicons",
      name: "barbell-outline",
    },
  },
} satisfies Record<AppIconName, IconVariantDefinition>;
