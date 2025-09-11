**fakemesh** es una topología de red formada por un `controlador (AC)`, uno o más `AP cableados` y `satélites (Agent)`. Es una red híbrida que combina los modos `Mesh inalámbrico` y `AC+AP`. Los AP cableados se conectan al controlador mediante Ethernet, mientras que los satélites lo hacen por Wi-Fi como clientes STA, formando una red de cobertura inalámbrica (que también puede incluir enlaces cableados).

El despliegue es sencillo: conecta cada nodo a la red adecuada y configura su rol, Mesh ID y otros parámetros. fakemesh facilita crear una red híbrida, mejorando cobertura y fiabilidad.

Actualmente, fakemesh viene integrado por defecto.

## Acceso a Dispositivos Tras la Configuración

- Controlador: `http://controller.fakemesh/` o `http://ac.fakemesh/`
- AP: `http://{mac}.ap.fakemesh/` o `http://N.ap.fakemesh/`  
  (donde `{mac}` es la MAC del AP y `N` un número asignado automáticamente)

Ejemplo:
```
http://1.ap.fakemesh/
http://1122334455AB.ap.fakemesh/
```

## Resolución de Problemas

Si un AP pierde conexión durante más de 3 minutos, entra en modo fallo y habilita un SSID por defecto para reconfiguración:
```
SSID: mesh-brudalevante
CONTRASEÑA: 12345678
```
La IP de gestión será la puerta de enlace DHCP, por ejemplo, `192.168.16.1` si tu PC obtiene `192.168.16.x`.

## Componentes Básicos

- **Controlador (AC):** Router principal y gestor de la red inalámbrica.
- **Satélite (Agent):** AP conectado por Wi-Fi.
- **AP cableado:** AP conectado por Ethernet.

## Parámetros Clave de Configuración

1. **Mesh ID:** Igual en todos los nodos.
2. **Clave:** Contraseña compartida (dejar en blanco para abierta).
3. **Banda:** 2G, 5G o 6G; todos los nodos deben coincidir.
4. **Rol:** Controlador, Satélite o AP cableado.
5. **Sync Config:** Configuración centralizada desde el controlador.
6. **Dirección IP de acceso:** IP de gestión del controlador.
7. **Desactivar Fronthaul:** Impide que otros usen este nodo como uplink.
8. **Band Steer Helper:** Elige [DAWN](https://github.com/fakemesh/dawn) o [usteer](https://github.com/fakemesh/usteer).

## Gestión Inalámbrica

Gestiona toda la red inalámbrica (SSIDs, cifrado, ancho de banda, etc.) desde la interfaz del controlador.

## Controlador en Modo “Bypass”

Si el controlador no es gateway ni servidor DHCP, configura manualmente IP LAN, gateway y DNS. Por defecto es cliente DHCP. Si usas IP fija, asegúrate de que está en la misma subred que el gateway para sincronizar la configuración.

---

¡Gracias a todos los que han hecho posible este proyecto!
Gracias por todo el trabajo realizado hasta ahora—aún nos queda mucho por hacer y muchas ideas por delante.
