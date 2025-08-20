// Diccionario de mensajes en español
export const es = {
    // Navegación
    navigation: {
        overview: "Resumen",
        transactions: "Transacciones",
        categories: "Categorías",
        analytics: "Análisis",
        accounts: "Cuentas",
        wallet: "Billetera"
    },

    // Dashboard
    dashboard: {
        greeting: "¡Hola, Mark!",
        balance: "Balance",
        income: "Ingresos",
        expenses: "Gastos",
        addIncome: "Agregar ingreso",
        addIncomeDescription: "Crear un ingreso manualmente",
        addExpense: "Agregar gasto",
        addExpenseDescription: "Crear un gasto manualmente",
        transfer: "Transferir",
        transferDescription: "Transferir entre cuentas",
        createGoal: "Crear meta",
        createGoalDescription: "Establecer una nueva meta financiera"
    },

    // Transacciones
    transactions: {
        addTransaction: "Agregar transacción",
        editTransaction: "Editar transacción",
        viewTransaction: "Ver transacción",
        addIncome: "Agregar ingreso",
        addExpense: "Agregar gasto",
        transfer: "Transferir dinero",
        type: "Tipo",
        amount: "Monto",
        description: "Descripción",
        category: "Categoría",
        paymentMethod: "Método de Pago",
        date: "Fecha",
        cancel: "Cancelar",
        save: "Guardar",
        income: "Ingreso",
        expense: "Gasto",
        recentTransactions: "Transacciones recientes",
        noTransactions: "No se encontraron transacciones",
        checkLastTransactions: "Revisa tus últimas transacciones",
        method: "Método",

        table: {
            date: "Fecha",
            description: "Descripción",
            type: "Tipo",
            category: "Categoría",
            amount: "Monto",
            method: "Método",
            status: "Estado",
            actions: "Acciones",
            noTransactionsFound: "No se encontraron transacciones"
        },
        options: {
            edit: "Editar",
            delete: "Eliminar",
            viewContent: "Ver contenido"
        },

        // Tipos de transacción
        types: {
            income: "Ingreso",
            expense: "Gasto",
            transfer: "Transferencia"
        },

        // Métodos de pago
        paymentMethods: {
            bankAccount: "Cuenta Bancaria",
            creditCard: "Tarjeta de Crédito",
            debitCard: "Tarjeta de Débito",
            cash: "Efectivo",
            paypal: "PayPal",
            other: "Otro"
        },

        // Placeholders
        placeholders: {
            selectType: "Seleccionar tipo de transacción",
            enterAmount: "0.00",
            enterDescription: "Ingrese la descripción de la transacción",
            selectCategory: "Seleccionar categoría",
            selectPaymentMethod: "Seleccionar método de pago"
        },

        // Historial
        history: {
            title: "Historial de Transacciones",
            noTransactions: "No hay transacciones disponibles",
            loading: "Cargando transacciones..."
        }
    },

    // Categorías
    categories: {
        title: "Gestión de Categorías",
        addCategory: "Agregar Categoría",
        editCategory: "Editar Categoría",
        name: "Nombre",
        color: "Color",
        icon: "Icono",
        type: "Tipo",
        search: "Buscar categorías...",
        filter: "Filtrar por tipo",
        all: "Todas",
        income: "Ingresos",
        expense: "Gastos",
        both: "Ambos",
        delete: "Eliminar",
        edit: "Editar",
        save: "Guardar",
        cancel: "Cancelar",

        // Iconos predefinidos
        icons: {
            groceries: "Comestibles",
            creditCard: "Tarjeta de Crédito",
            transportation: "Transporte",
            shopping: "Compras",
            house: "Casa/Facturas",
            health: "Salud",
            education: "Educación",
            travel: "Viajes",
            income: "Ingresos",
            freelance: "Freelance",
            bonus: "Bonificación"
        },

        placeholders: {
            enterName: "Ingrese el nombre de la categoría",
            selectType: "Seleccionar tipo",
            selectIcon: "Seleccionar icono"
        }
    },

    // Estadísticas
    stats: {
        thisMonth: "Este mes",
        lastMonth: "Mes pasado",
        thisYear: "Este año",
        lastYear: "Año pasado",
        last12Months: "Últimos 12 meses",
        expensesByCategory: "Gastos por Categoría",
        noExpenses: "No hay gastos en este período"
    },

    // Formularios
    forms: {
        amount: "Monto",
        description: "Descripción",
        descriptionPlaceholder: "Ingresa la descripción de la transacción",
        category: "Categoría",
        categoryPlaceholder: "Selecciona una categoría",
        date: "Fecha",
        type: "Tipo",
        typePlaceholder: "Selecciona el tipo de transacción",
        paymentMethod: "Método de pago",
        paymentMethodPlaceholder: "Selecciona el método de pago",
        submit: "Enviar",
        cancel: "Cancelar",
        close: "Cerrar",
        save: "Guardar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        required: "Este campo es obligatorio",
        invalidAmount: "Ingrese un monto válido",
        invalidEmail: "Ingrese un email válido",
        passwordTooShort: "La contraseña debe tener al menos 8 caracteres"
    },

    // Mensajes del sistema
    messages: {
        success: {
            transactionCreated: "Transacción creada exitosamente",
            transactionUpdated: "Transacción actualizada exitosamente",
            transactionDeleted: "Transacción eliminada exitosamente",
            categoryCreated: "Categoría creada exitosamente",
            categoryUpdated: "Categoría actualizada exitosamente",
            categoryDeleted: "Categoría eliminada exitosamente"
        },
        error: {
            generic: "Ha ocurrido un error. Por favor, inténtelo de nuevo.",
            networkError: "Error de conexión. Verifique su conexión a internet.",
            transactionNotFound: "Transacción no encontrada",
            categoryNotFound: "Categoría no encontrada",
            invalidData: "Los datos ingresados no son válidos"
        },
        loading: {
            saving: "Guardando...",
            loading: "Cargando...",
            deleting: "Eliminando...",
            updating: "Actualizando..."
        },
        delete: {
            title: "Confirmar eliminación",
            message: "¿Estás seguro de eliminar esta transacción?",
            messageWithItem: "¿Estás seguro de eliminar la transacción {itemName}?",
            success: "Transacción eliminada exitosamente"
        }
    },

    // Tema
    theme: {
        switchToLight: "Cambiar a modo claro",
        switchToDark: "Cambiar a modo oscuro"
    },

    // Períodos de tiempo
    periods: {
        thisWeek: "Esta semana",
        thisMonth: "Este mes",
        lastMonth: "Mes pasado",
        thisYear: "Este año",
        lastYear: "Año pasado",
        last12Months: "Últimos 12 meses",
        allTime: "Todo el tiempo",
        selectPeriod: "Seleccionar período"
    },

    // Métodos de pago
    paymentMethods: {
        cash: "Efectivo",
        card: "Tarjeta",
        transfer: "Transferencia",
        check: "Cheque",
        other: "Otro"
    },

    // Botones comunes
    buttons: {
        add: "Agregar",
        edit: "Editar",
        delete: "Eliminar",
        save: "Guardar",
        cancel: "Cancelar",
        close: "Cerrar",
        confirm: "Confirmar",
        back: "Volver",
        next: "Siguiente",
        previous: "Anterior",
        search: "Buscar",
        filter: "Filtrar",
        reset: "Restablecer",
        submit: "Enviar"
    },

    // Filtros de transacciones
    filters: {
        title: "Filtros",
        titleTransactions: "Filtros de transacciones",
        clearFilters: "Limpiar filtros",
        searchTransactions: "Buscar transacciones...",
        selectType: "Seleccionar tipo",
        selectStatus: "Seleccionar estado",
        selectCategory: "Seleccionar categoría",
        dateFrom: "Fecha desde",
        dateTo: "Fecha hasta",
        minAmount: "Monto mínimo",
        maxAmount: "Monto máximo",
        allCategories: "Todas las categorías"
    },

    // Estados de transacciones
    status: {
        pending: "Pendiente",
        completed: "Completada",
        cancelled: "Cancelada"
    },

    // Valores generales
    general: {
        all: "Todos",
        income: "Ingreso",
        expense: "Gasto",
        transfer: "Transferencia",
        currencySymbol: "$"
    },

    // Acciones comunes
    common: {
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        remove: "Quitar",
        confirm: "Confirmar",
        close: "Cerrar",
        back: "Volver",
        next: "Siguiente",
        previous: "Anterior",
        search: "Buscar",
        filter: "Filtrar",
        sort: "Ordenar",
        export: "Exportar",
        import: "Importar",
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        warning: "Advertencia",
        info: "Información"
    }
};

export type Messages = typeof es;