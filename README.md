# JuegoToeriaDeSistemas · Misión Decisiones

Juego de preguntas en vivo para ocho equipos y un anfitrión. Cada estudiante entra sin cuenta; su puntuación individual se promedia con la de su equipo. La aplicación incluye las cuatro preguntas proporcionadas y dos adicionales, lectura previa sin reloj, consulta del escenario, seis rondas, podio y descarga CSV.

## Antes de comenzar

- Necesitas un proyecto de Supabase y una cuenta de Vercel. Los participantes necesitan conexión a internet.
- **No compartas ni subas claves secretas.** No incluyas `.env`, `.env.local` ni credenciales en Git. La clave de servicio solo debe configurarse en el servidor, nunca con prefijo `VITE_`.
- El servidor usa la clave de servicio de Supabase. Cualquier persona que la obtenga tendrá acceso amplio al proyecto: usa preferiblemente un proyecto dedicado y conserva la clave únicamente en las variables de entorno de Vercel.

## 1. Preparar la base de datos

1. En Supabase crea un proyecto o selecciona uno existente.
2. Abre **SQL Editor**, crea una consulta y pega todo el contenido de `supabase.sql`. Ejecútalo.
3. El script crea las tablas `quiz_games`, `quiz_players`, `quiz_answers` y la función `quiz_submit`. No crea permisos públicos: la API del servidor accede usando la clave de servicio. No ejecutes este script sobre otras tablas con esos nombres si ya existen.
4. Copia la URL del proyecto y la clave secreta `service_role` desde los ajustes/API de Supabase. Según la versión del panel, las claves antiguas pueden aparecer en **Legacy API keys**. Usa la clave `service_role`, no la clave pública `anon`.

## 2. Publicar en Vercel

1. Sube esta carpeta a un repositorio privado de GitHub, sin archivos `.env` ni credenciales. Importa ese repositorio desde Vercel. Si la carpeta está dentro de un repositorio mayor, selecciona `Juego` como **Root Directory**.
2. Selecciona el framework **Vite** si Vercel no lo detecta automáticamente. El comando de compilación es `npm run build` y el directorio de salida es `dist`.
3. En **Environment Variables** configura, para el entorno de producción:
   - `SUPABASE_URL`: URL del proyecto de Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: clave secreta `service_role`.
   - `HOST_PASSWORD`: contraseña larga y única para crear partidas. Compártela solo con los anfitriones.
4. Despliega. Si agregas o cambias variables después de desplegar, vuelve a desplegar para que estén disponibles.
5. Abre el dominio HTTPS asignado por Vercel y crea una sala como anfitrión. Comparte el QR o el enlace y el PIN. El enlace del QR ya incluye el PIN.

También puedes utilizar Vercel CLI para desplegar; sigue sus instrucciones para iniciar sesión en tu propio dispositivo. No envíes contraseñas ni tokens por chat.

## 3. Realizar la actividad

1. El anfitrión entra con `HOST_PASSWORD`, crea la sala y proyecta el PIN y el QR.
2. Los participantes escriben nombre, seleccionan equipo 1–8 y eligen personaje y color. En la sala de espera, el anfitrión puede retirar una inscripción errónea pulsando sobre su tarjeta. No se pueden retirar jugadores después de empezar, para no alterar los promedios.
3. Al comenzar se muestra el escenario sin reloj. El anfitrión elige el tiempo y abre las respuestas. La pregunta permanece visible y el botón **Volver a leer el escenario** permite consultar el texto.
4. Una respuesta enviada no se puede cambiar. El anfitrión puede cerrar anticipadamente la ronda; de lo contrario se cierra cuando se agota el tiempo. Se muestra la respuesta y la explicación, y el anfitrión avanza.
5. El podio muestra los equipos con participantes; la tabla muestra los ocho equipos y permite consultar sus integrantes. El anfitrión puede descargar los resultados en CSV.

### Puntos y empates

El servidor calcula **de 500 a 1.000 puntos** por respuesta correcta: 1.000 al inicio y una reducción lineal hasta 500 al final. Respuesta incorrecta, no enviada o recibida después del límite: 0. No hay bono de racha. Se utiliza la hora de recepción en el servidor; la latencia de cada conexión puede influir ligeramente.

El puntaje de equipo es el promedio de los puntos acumulados por todos sus integrantes activos, redondeado al entero más cercano. Un jugador que se desconecte después de empezar sigue contando, incluso si no responde. Los equipos sin integrantes no compiten. En caso de empate en puntos redondeados, se muestran por número de equipo.

### Conexión y privacidad

La interfaz consulta el estado cada 1,5 segundos a través de una función de Vercel y Supabase; no se requiere que todos estén en la misma red. El reloj y el puntaje se validan en el servidor. La respuesta correcta no se entrega a la interfaz hasta el cierre de la ronda. Cada dispositivo guarda su acceso en el almacenamiento local para volver a la partida tras una recarga; borrar los datos del navegador o cambiar de dispositivo impide esa reconexión automática. Un jugador retirado deja de tener acceso. Los anfitriones también recuperan su sesión en el mismo navegador; quien tenga acceso a ese navegador podría controlarla.

No existe verificación de identidad ni un mecanismo para impedir que una persona se una dos veces: supervisa los nombres y equipos antes de empezar. El enlace y el PIN no son secretos. No incluyas información personal sensible en los nombres. Las partidas y los resultados permanecen guardados en Supabase hasta que un administrador los elimine. Protege y elimina esos datos según las necesidades de la institución. Las tablas tienen RLS y no hay políticas de acceso público; la API requiere las credenciales de sala para consultar los datos. Para despliegues públicos de largo plazo se recomienda añadir límites de solicitudes, caducidad y limpieza automática de partidas.

## Desarrollo y pruebas

Instala Node.js y ejecuta `npm install`. Para compilar: `npm run build`. `npm run dev` inicia únicamente Vite y **no** ejecuta la API de Vercel; para probar el flujo completo localmente, configura un archivo `.env.local` basado en `.env.example` y usa `vercel dev` con Vercel CLI. No subas ese archivo.

Antes de la presentación, prueba una partida completa con varios celulares y redes distintas, comprueba QR, lectura, tiempo, reconexión, puntajes, podio y CSV. Verifica los límites vigentes de Vercel y Supabase para el número esperado de participantes y solicitudes. La implementación no incluye actualizaciones Supabase Realtime: usa consultas periódicas, por lo que puede haber una pequeña demora visible.
