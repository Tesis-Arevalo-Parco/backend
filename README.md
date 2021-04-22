# Proyecto de Tesis Backend

## Descripción

Backend del proyecto de tesis.

### Desarrolladores
- Alex Arevalo  
- Marco Parco

## Instalar dependencias

- Instalar [nvm](https://github.com/nvm-sh/nvm) y ejecutar el siguiente comando para usar la versión de node del proyecto.

    ```bash
    nvm use
    ```

- Luego instalar las dependencias con el siguiente comando

    ```bash
    npm install
    ```

## Instalar la base de datos

- Instalar [mongodb](https://www.mongodb.com/try/download/community) la versión `v4.2.13`
- Luego ejecutar el siguiente comando para cargar la base de datos
    ```bash
    npm run load_fixtures
    ```
- El siguiente comando ejecutar solamente cuando se han realizado cambios dentro de la base de datos
    ```bash
    npm run export_fixtures
    ```


## Ejecutar el proyecto

- Para ejecutar el proyecto en modo de `desarrollo` ejecutar el siguiente comando:

    ```
    npm run develop
    ```
- Para ejecutar el proyecto en modo de `producción` ejecutar el siguiente comando:

    ```
    npm run build
    ```