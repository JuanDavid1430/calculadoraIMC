# SmithStrong - Sistema de Gestión de IMC

Un sistema web completo para la gestión del Índice de Masa Corporal desarrollado con Angular 18 y diseñado para el gimnasio SmithStrong.

## 🏋️‍♂️ Descripción

SmithStrong es una aplicación web que permite a los usuarios:
- Registrarse y autenticarse en el sistema
- Calcular su IMC (Índice de Masa Corporal)
- Consultar su historial de mediciones
- Obtener recomendaciones personalizadas de rutinas de ejercicio y dietas
- Gestionar su perfil personal incluyendo información sobre discapacidades

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **Autenticación de usuarios**
  - Registro con datos personales completos
  - Login con email y contraseña
  - Guards para proteger rutas
  - Manejo de sesiones con JWT (preparado)

- **Cálculo de IMC**
  - Calculadora interactiva con validaciones
  - Cálculo automático y clasificación
  - Guardado en historial
  - Interfaz responsive y amigable

- **Historial de IMC**
  - Vista completa de todos los registros
  - Estadísticas de tendencias
  - Visualización de cambios en el tiempo
  - Tabla responsive con datos detallados

- **Recomendaciones Personalizadas**
  - Rutinas de ejercicio adaptadas al IMC
  - Planes de dieta personalizados
  - Adaptaciones para discapacidades
  - Consejos adicionales de salud

- **Gestión de Perfil**
  - Edición de datos personales
  - Cambio de email y contraseña
  - Configuración de discapacidades
  - Estadísticas de uso de la cuenta

### 🎨 Diseño y UX

- **Material Design**: Interfaz moderna con Angular Material
- **Responsive**: Adaptable a dispositivos móviles y desktop
- **Accesibilidad**: Diseñado considerando diferentes tipos de discapacidades
- **Tema Personalizado**: Colores corporativos de SmithStrong
- **Animaciones**: Transiciones suaves y feedback visual

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 18**: Framework principal
- **Angular Material 18**: Componentes UI/UX
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **CSS3**: Estilos personalizados
- **HTML5**: Estructura semántica

### Backend (Preparado para integración)
- **API REST**: Endpoints definidos para backend
- **JWT**: Autenticación con tokens
- **MySQL**: Base de datos relacional
- **HTTP Client**: Comunicación con APIs

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── login/          # Componente de inicio de sesión
│   │   ├── register/       # Componente de registro
│   │   ├── dashboard/      # Panel principal
│   │   ├── calculator/     # Calculadora de IMC
│   │   ├── history/        # Historial de registros
│   │   ├── recommendations/# Recomendaciones
│   │   └── profile/        # Perfil del usuario
│   ├── services/           # Servicios para APIs
│   │   ├── auth.service.ts # Autenticación
│   │   ├── imc.service.ts  # Cálculos de IMC
│   │   └── recommendation.service.ts # Recomendaciones
│   ├── models/             # Interfaces TypeScript
│   │   ├── auth.model.ts   # Modelos de autenticación
│   │   ├── user.model.ts   # Modelos de usuario
│   │   ├── imc.model.ts    # Modelos de IMC
│   │   └── recommendation.model.ts # Modelos de recomendaciones
│   ├── guards/             # Guards de rutas
│   ├── interceptors/       # Interceptors HTTP
│   └── environments/       # Configuraciones de entorno
├── assets/                 # Recursos estáticos
└── styles.css             # Estilos globales
```

## 🗄️ Base de Datos

### Modelo de Datos MySQL

El sistema utiliza las siguientes tablas principales:

- **User**: Credenciales y datos de autenticación
- **Person**: Información personal de los usuarios
- **History**: Historial de cálculos de IMC
- **Rutine**: Rutinas de ejercicio disponibles
- **Diet**: Planes de dieta disponibles
- **Class**: Clasificaciones de IMC (A, B, C, etc.)
- **Disability**: Tipos de discapacidades
- **Rutine_Disability**: Rutinas adaptadas para discapacidades

### Script de Base de Datos

El archivo `database/smithstrong_imc.sql` contiene:
- Estructura completa de tablas
- Relaciones y restricciones
- Datos de ejemplo (seeds)
- Vistas optimizadas
- Procedimientos almacenados
- Índices para rendimiento

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Cálculo de IMC
- `POST /api/history/calculate` - Calcular y guardar IMC
- `GET /api/history/:userId` - Obtener historial

### Recomendaciones
- `GET /api/recommendation/:userId` - Obtener recomendaciones
- `GET /api/rutines` - Listar rutinas
- `GET /api/diets` - Listar dietas
- `GET /api/disabilities` - Listar discapacidades

### Gestión de Datos
- `GET /api/classes` - Clasificaciones de IMC
- `GET /api/rutines/class/:classId` - Rutinas por clase
- `GET /api/diets/class/:classId` - Dietas por clase

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Angular CLI 18
- MySQL 8.0+

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd calculadoraIMC
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar base de datos**
   ```bash
   # Ejecutar el script SQL en MySQL
   mysql -u root -p < database/smithstrong_imc.sql
   ```

4. **Configurar environment**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api'
   };
   ```

5. **Ejecutar la aplicación**
   ```bash
   ng serve
   ```

6. **Acceder a la aplicación**
   ```
   http://localhost:4200
   ```

## 📱 Uso de la Aplicación

### 1. Registro de Usuario
- Crear cuenta con email y contraseña
- Completar datos personales (nombre, edad, género)
- Seleccionar discapacidad si aplica

### 2. Cálculo de IMC
- Ingresar peso (kg) y altura (cm)
- Obtener resultado instantáneo
- Ver clasificación automática
- Guardar en historial

### 3. Consulta de Historial
- Ver todos los registros de IMC
- Observar tendencias y cambios
- Estadísticas personalizadas

### 4. Recomendaciones
- Rutinas de ejercicio personalizadas
- Planes de dieta adaptados
- Consejos de salud específicos

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Guards de Rutas**: Protección de rutas privadas
- **Validación de Datos**: Validaciones en frontend y backend
- **Sanitización**: Prevención de inyecciones XSS

## 📊 Características de Accesibilidad

- **Adaptabilidad**: Rutinas adaptadas para diferentes discapacidades
- **Material Design**: Componentes accesibles por defecto
- **Navegación**: Estructura clara y navegación intuitiva
- **Responsive**: Funciona en todos los dispositivos

## 🎯 Próximas Características

- [ ] Integración con backend real
- [ ] Gráficos de progreso avanzados
- [ ] Notificaciones push
- [ ] Exportación de datos PDF
- [ ] API móvil
- [ ] Integración con wearables

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para nueva característica
3. Commit cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## 👥 Equipo de Desarrollo

- **Frontend**: Angular 18 + Angular Material
- **Backend**: Preparado para Node.js/Express
- **Base de Datos**: MySQL con estructura optimizada
- **Diseño**: Material Design con tema personalizado

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@smithstrong.com
- Web: www.smithstrong.com

---

**SmithStrong** - Tu socio en el camino hacia una vida más saludable 💪
