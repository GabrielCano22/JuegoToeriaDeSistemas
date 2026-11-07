# Misión Decisiones

**Un juego de preguntas multijugador para aprender, tomar decisiones y competir en equipo.**

[Jugar en línea](https://mision-decisiones.vercel.app) · [Cómo jugar](#cómo-jugar) · [Puntuación y notas](#puntuación-y-notas) · [Configuración](#configuración-y-despliegue)

---

## Acerca del proyecto

Misión Decisiones es una actividad educativa desarrollada para la asignatura **Teoría de Sistemas**, a partir de una presentación sobre políticas y decisiones basada en material de Sterman (2000) y en el curso de Dinámica de Sistemas de la Universidad Nacional de Colombia, sede Medellín.

El equipo anfitrión dirige una partida en vivo mientras los integrantes de los equipos participantes responden desde sus propios dispositivos. Cada persona acumula puntos individualmente y el resultado del equipo se calcula mediante un promedio, de modo que los equipos con diferente número de integrantes puedan competir en igualdad de condiciones.

La actividad está preparada para **ocho equipos participantes**, un equipo anfitrión y seis preguntas. No se requieren cuentas para jugar.

## Funcionalidades

- **Partidas en vivo:** acceso mediante enlace, código QR o PIN, sin necesidad de compartir la misma red.
- **Personajes personalizables:** selección de personaje, colores, ropa, sombreros y lentes.
- **Control del anfitrión:** creación de salas, revisión de participantes, inicio y avance de las rondas.
- **Lectura accesible:** cada escenario se presenta sin temporizador y puede consultarse nuevamente durante la pregunta.
- **Cierre automático:** la ronda termina cuando todos han respondido o cuando se agota el tiempo.
- **Música dinámica:** secuencia original en el dispositivo del anfitrión, con mayor ritmo durante los últimos diez segundos y opción de silencio.
- **Clasificación colectiva:** puntuación individual, promedio por equipo, empates compartidos y podio final.
- **Informes descargables:** Excel editable con estilos y filtros, y PDF listo para compartir o imprimir.
- **Reconexión:** recuperación de la sesión en el mismo navegador si la página se recarga.
- **Diseño adaptable:** vistas para el computador del anfitrión y los dispositivos de los participantes.

## Tecnologías

| Área | Herramientas |
| --- | --- |
| Interfaz | React y Vite |
| Servidor | Funciones de Vercel para Node.js |
| Base de datos | Supabase y PostgreSQL |
| Archivos | ExcelJS, jsPDF y jsPDF-AutoTable |
| Recursos adicionales | Web Audio API, SVG y códigos QR |

La aplicación sincroniza el estado mediante **consultas periódicas** a la API; no utiliza Supabase Realtime ni WebSockets. Puede existir una pequeña demora visual entre dispositivos.

## Cómo jugar

### Anfitrión

1. Abre la [aplicación](https://mision-decisiones.vercel.app), selecciona **Soy anfitrión** e introduce la clave configurada.
2. Proyecta el PIN o el código QR y espera a que los participantes ingresen.
3. Verifica los nombres y equipos. Puedes retirar una inscripción incorrecta desde la sala de espera, antes de comenzar.
4. Inicia la partida y presenta cada escenario sin temporizador. Cuando todos estén listos, selecciona el tiempo e inicia las respuestas.
5. Revisa la respuesta correcta y la explicación al cerrar cada ronda; después, avanza a la siguiente pregunta.
6. Al finalizar, consulta el podio y descarga los resultados en Excel o PDF.

La música se reproduce únicamente en el dispositivo del anfitrión. Si el navegador la bloquea o se recarga la página, utiliza el botón de sonido para activarla. Es recomendable comprobar el volumen y los parlantes antes de la actividad.

### Participantes

1. Entra mediante el enlace o el QR compartido por el anfitrión.
2. Introduce el PIN si es necesario, escribe tu nombre, personaliza tu personaje y selecciona tu equipo.
3. Lee cada escenario y responde dentro del tiempo establecido. Si lo necesitas, utiliza **Volver a leer el escenario**.
4. Una vez enviada, la respuesta no se puede modificar. Al finalizar cada ronda se muestra la respuesta correcta.

Si alguien se desconecta y no responde, la ronda no espera indefinidamente: termina cuando se agota el tiempo o el anfitrión la cierra. Los participantes desconectados siguen contando para el promedio de su equipo.

## Puntuación y notas

### Puntos individuales y colectivos

- Una respuesta correcta otorga entre **500 y 1.000 puntos**, según la rapidez. El puntaje disminuye linealmente desde 1.000 al inicio hasta 500 al final.
- Una respuesta incorrecta, no enviada o recibida fuera de tiempo otorga **0 puntos**. No hay bono por racha.
- El servidor valida el tiempo de recepción; la latencia de la conexión puede influir ligeramente.
- El puntaje de cada equipo es el **promedio de los puntos acumulados por sus integrantes activos**, redondeado al entero más cercano.
- Los equipos empatados en puntos redondeados comparten posición y nota. Se usa clasificación de competición: por ejemplo, **1.º, 1.º, 3.º**. Los equipos sin integrantes no compiten ni reciben nota.

### Nota base por posición

| Posición | Nota base | Posición | Nota base |
| --- | ---: | --- | ---: |
| 1.º | 5,0 | 5.º | 4,5 |
| 2.º | 4,8 | 6.º | 4,4 |
| 3.º | 4,7 | 7.º | 4,2 |
| 4.º | 4,6 | 8.º | 4,0 |

La nota final es la **menor** entre la nota base y el límite aplicable según el puntaje promedio del equipo:

| Puntos promedio | Nota máxima permitida |
| --- | ---: |
| 2.000 o más | Sin límite adicional |
| 1.500–1.999 | 3,9 |
| 1.000–1.499 | 3,7 |
| 500–999 | 3,5 |
| 1–499 | 3,2 |
| 0 | 3,0 |

El límite se aplica también al primer lugar. La nota es **colectiva**, no individual. El Excel y el PDF incluyen posición, equipo, promedio, nota, integrantes y puntos individuales; los equipos sin participantes aparecen sin posición ni nota.

## Estructura del proyecto

```text
Juego/
├── api/                         # API de la partida para Vercel
├── public/                      # Favicon, iconos y manifiesto web
├── src/                         # Interfaz, personajes, música e informes
├── supabase/                    # Actualización SQL para instalaciones existentes
├── tests/                       # Pruebas de puntuación e informes
├── questions.js                 # Escenarios, preguntas y respuestas
├── scores.js                    # Clasificación y cálculo de notas
├── supabase.sql                 # Esquema y función de la base de datos
├── .env.example                 # Nombres de las variables necesarias
└── vercel.json                  # Configuración de rutas
```

## Desarrollo local

### Requisitos

- Node.js 20 o posterior y npm.
- Un proyecto de Supabase configurado para el juego.
- Vercel CLI para ejecutar la interfaz y la API juntas en local.

```bash
npm install
npm run build
npm test
```

`npm run dev` inicia únicamente la interfaz de Vite; **no ejecuta la API**. Para probar una partida completa en local, configura un archivo `.env.local` a partir de `.env.example` y ejecuta `vercel dev` con Vercel CLI. La API necesita acceso a Supabase.

## Configuración y despliegue

### 1. Preparar Supabase

1. Crea o selecciona un proyecto de Supabase, preferiblemente dedicado al juego.
2. En **SQL Editor**, ejecuta el contenido de `supabase.sql`.
3. El script crea las tablas `quiz_games`, `quiz_players`, `quiz_answers` y la función `quiz_submit`. Antes de ejecutarlo, verifica que el proyecto no tenga tablas existentes con esos nombres que deban conservarse.
4. Obtén la URL del proyecto y su clave secreta **`service_role`** desde los ajustes de API. En algunas versiones del panel puede aparecer en **Legacy API keys**.

Para una instalación anterior que ya tenga el esquema inicial, `supabase/close_when_answered.sql` actualiza la función de envío para habilitar el cierre automático cuando todos responden.

### 2. Configurar Vercel

Importa el repositorio en Vercel o despliega mediante Vercel CLI. Si el proyecto se encuentra dentro de un repositorio más grande, selecciona la carpeta `Juego` como directorio raíz.

| Ajuste | Valor |
| --- | --- |
| Framework | Vite |
| Comando de compilación | `npm run build` |
| Directorio de salida | `dist` |

Configura estas variables de entorno en el servidor de Vercel:

| Variable | Propósito |
| --- | --- |
| `SUPABASE_URL` | URL del proyecto de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta `service_role`, utilizada exclusivamente por la API. |
| `HOST_PASSWORD` | Clave para crear partidas como anfitrión. |

Usa una clave de anfitrión larga y única. Si modificas variables después de un despliegue, vuelve a desplegar para aplicarlas. La conexión del repositorio a Vercel es necesaria si se desean despliegues automáticos con cada cambio; de lo contrario, se puede desplegar manualmente con Vercel CLI.

## Seguridad y privacidad

> **Nunca incluyas contraseñas, tokens ni claves de servicio en el repositorio o en el código del navegador.** La clave `service_role` tiene acceso amplio a Supabase y debe permanecer exclusivamente en el servidor; no debe utilizar el prefijo `VITE_`.

- Las tablas usan RLS y no tienen políticas de acceso público; la API opera desde el servidor con la clave de servicio.
- El PIN y el enlace de la sala no son secretos. La aplicación no verifica la identidad ni impide que una persona se inscriba varias veces: el anfitrión debe revisar los participantes antes de comenzar.
- La sesión se conserva en el almacenamiento local del navegador. Borrar sus datos o cambiar de dispositivo impide la reconexión automática; quien tenga acceso al navegador del anfitrión podría controlar su sesión.
- No se deben utilizar datos sensibles como nombres. Las partidas y resultados permanecen en Supabase hasta que un administrador los elimine.
- Para un despliegue público permanente se recomienda añadir límites de solicitudes, caducidad de salas y limpieza automática de datos.

## Antes de la actividad

Realiza una partida de prueba con varios dispositivos y conexiones diferentes. Comprueba el QR, el sonido, los tiempos, la reconexión, los puntajes, el podio y las descargas de Excel y PDF. También conviene revisar los límites vigentes de los planes de Vercel y Supabase para la cantidad prevista de participantes.

---

Proyecto académico para la actividad del **Equipo 9 · Teoría de Sistemas**.
