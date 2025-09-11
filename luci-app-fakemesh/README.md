Introducción a fakemesh
fakemesh es una topología de red compuesta por un controlador (AC) y uno o varios AP cableados (Wired AP) y satélites (Agent). Es una red híbrida que combina dos modos de agrupación: Mesh inalámbrico y AC+AP. En este esquema, los AP cableados se conectan al controlador (AC) mediante cable de red, mientras que los satélites (Agent) se conectan de forma inalámbrica como clientes STA, formando juntos una red de cobertura inalámbrica (que también puede incluir nodos cableados).

La implementación de fakemesh es relativamente sencilla: solo necesitas conectar los dispositivos nodo a la red correcta y configurar el rol y el Mesh ID de cada uno. Al combinar los modos inalámbrico Mesh y AC+AP, resulta muy fácil crear una red mixta, lo que mejora tanto la cobertura como la fiabilidad de la red.

Actualmente,brudalevante https://github.com/brudalevante/rc4-maxima-potencia-espejo.git integra fakemesh por defecto.

Uso de fakemesh
Una vez creada la red, las direcciones de acceso a los dispositivos siguen este formato:
Acceso al controlador: http://controller.fakemesh/ o http://ac.fakemesh/

Acceso a los AP: http://{mac}.ap.fakemesh/ o http://N.ap.fakemesh/

Donde {mac} es la dirección MAC del AP, por ejemplo {mac}=1122334455AB, y N es el número automático asignado al AP, como N=1, N=2, N=3, ...

Ejemplos:

Code
http://1.ap.fakemesh/
http://1122334455AB.ap.fakemesh/
Resolución de fallos:
Si un AP queda offline unos 3 minutos, entra en modo de fallo. En este modo, se activa un SSID por defecto que permite acceder para reconfigurar el dispositivo. El SSID y la contraseña por defecto en modo fallo son:

Code
SSID: mesh-brudalevante
CONTRASEÑA: 12345678
En modo fallo, la IP de gestión del AP será la puerta de enlace asignada por DHCP. Por ejemplo, si tu PC recibe la IP 192.168.16.x, la IP de gestión del AP será 192.168.16.1.

Componentes básicos de fakemesh
La red se compone de un controlador (controller) y uno o más AP.

Los AP pueden ser: satélites (Agent) o AP cableados (Wired AP).

Controlador (Controller): Funciona como AC y router de salida, proporcionando acceso a Internet y gestionando de forma centralizada los satélites y AP cableados, así como la red inalámbrica.

Satélite (Agent): AP que se conecta a la red a través de Wi-Fi.

AP cableado (Wired AP): AP que se conecta a la red mediante cable Ethernet.

Parámetros de configuración de fakemesh
1. Mesh ID
Es el ID común de toda la red fakemesh. El controlador, los satélites y los AP cableados deben tener el mismo Mesh ID.

2. Clave (Key)
Contraseña compartida para la agrupación. Si no se desea encriptar, se puede dejar en blanco.

3. Banda (Band)
Banda de frecuencia inalámbrica utilizada en la red; debe ser la misma para todos. Puede ser 5G o 2G.

4. Rol (Role)
Puede ser controlador, satélite o AP cableado.

5. Sincronizar configuración (Sync Config)
Permite que la configuración Wi-Fi se gestione de manera centralizada desde el controlador.

6. Dirección IP de acceso (Access IP address)
Permite asignar una IP específica al controlador para acceder a su interfaz de gestión.

7. Desactivar fronthaul (Fronthaul Disabled)
Evita que otros AP se conecten a través de la Wi-Fi de este nodo.

8. Asistente de roaming (Band Steer Helper)
Actualmente se puede elegir entre DAWN y usteer como asistente de roaming.

Gestión inalámbrica (Wireless Management)
Desde la interfaz del controlador se puede gestionar de forma centralizada la red inalámbrica: añadir/eliminar SSID, configurar cifrado, ancho de banda, etc.

Despliegue del controlador (Controller) en modo bypass
Es importante saber que, si el controlador no actúa como puerta de enlace ni ofrece DHCP, deberás configurar manualmente la red: asignar la IP LAN, la puerta de enlace y el DNS del controlador. Normalmente, el puerto LAN del controlador tendrá activado el cliente DHCP para obtener IP y puerta de enlace de un router externo. Si usas IP estática, asegúrate de que el controlador y el router externo estén en la misma subred y puedan comunicarse, de lo contrario no funcionará la sincronización entre el controlador y los demás AP.
