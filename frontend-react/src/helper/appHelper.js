import dayjs from 'dayjs'

let toastRef = null

export const appHelper = {
  setToast: (ref) => {
    toastRef = ref
  },
  showToast: (type, message, summary) => {
    if (!toastRef) {
      console.warn('Toast not initialized yet!')
      return
    }

    const summaries = {
      info: 'Informasi',
      warn: 'Peringatan',
      error: 'Error',
      success: 'Sukses',
      contrast: 'Informasi',
    }

    toastRef.show({
      severity: type,
      summary: summary || summaries[type] || 'Informasi',
      detail: message,
      life: 3000,
    })
  },
  storage: {
    set(key, value) {
      if (typeof window === "undefined") return

      const store = typeof value === 'string'
        ? value
        : JSON.stringify(value)

      localStorage.setItem(key, store)
    },

    get(key) {
      if (typeof window === "undefined") return null

      const value = localStorage.getItem(key)

      if (!value) return null

      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    },

    remove(key) {
      if (typeof window === "undefined") return

      localStorage.removeItem(key)
    },

    clear() {
      if (typeof window === "undefined") return

      localStorage.clear()
    },
  },

  formatDate: (date, format = "YYYY-MM-DD HH:mm") => {
    return dayjs(date).format(format)
  }
}
