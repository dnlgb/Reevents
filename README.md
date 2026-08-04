# ReEvents

ReEvents es una plataforma para la gestión de eventos universitarios compuesta por una **aplicación móvil** para los usuarios a dirigir
y un **panel web de administración**, desarrollada para centralizar la organización, difusión y administración de actividades académicas
dentro de una institución o cualquier lugar.

Los estudiantes/usuarios pueden consultar los eventos disponibles, conocer su información y participar desde la aplicación móvil,
mientras que los administradores gestionan el contenido mediante un panel web conectado a la misma base de datos.

---

## Arquitectura del proyecto

El proyecto está dividido en dos aplicaciones que comparten los servicios de Supabase:

### Aplicación móvil

Pensada para los estudiantes/usuarios.

Permite:

* Consultar eventos disponibles.
* Visualizar información detallada de cada evento.
* Registrarse o participar en actividades.
* Navegar por categorías.
* Acceder desde dispositivos móviles mediante Expo(por ahora).

### Panel administrativo

Pensado para los administradores.

Permite:

* Iniciar sesión.
* Crear, editar y eliminar eventos.
* Gestionar categorías.
* Administrar la información almacenada en el sistema.
* Consultar la información relacionada con los eventos.

---

## Tecnologías

### Aplicación móvil

* React Native
* Expo
* JavaScript
* Supabase

### Panel web

* React
* Vite
* React Router
* CSS
* Supabase

---

## Base de datos

Ambas aplicaciones comparten una misma base de datos en Supabase, 
permitiendo que la información administrada desde el panel web esté disponible en tiempo real para los usuarios de la aplicación móvil.

