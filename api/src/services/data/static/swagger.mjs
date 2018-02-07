
const swaggerDefinition = {
    "swagger": "2.0",
    "info": {
        "description": "Sample Loyalty API",
        "version": "1.0.0",
        "title": "TryBaker API Swagger",
        "termsOfService": "http://www.trybaker.com/company",
        "contact": {
            "email": "admin@trybaker.com"
        },
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        }
    },
    "host": "localhost:3000",
    "basePath": "/",
    "tags": [],
    "schemes": [
        "http"
    ],
    "paths": {
        "/": {
            "get": {
                "tags": [
                    "ops"
                ],
                "summary": "Healthcheck Route",
                "description": "Always returns 204",
                "operationId": "healthCheck",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "parameters": [],
                "responses": {
                    "204": {
                        "description": "No Content"
                    }
                }
            }
        },
        "/swagger": {
            "get": {
                "tags": [
                    "ops"
                ],
                "summary": "Swagger JSON Definition",
                "description": "",
                "operationId": "swagger",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "parameters": [],
                "responses": {
                    "200": {
                        "description": "Swagger JSON for tooling support"
                    }
                }
            }
        },
        "/api/verify/email/{email}/{code}": {
            "get": {
                "tags": [
                    "verification"
                ],
                "summary": "Verify an {email, code} combo for authorization or registration",
                "description": "",
                "operationId": "verifyEmail",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "email",
                        "in": "path",
                        "description": "User's email address",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "code",
                        "in": "path",
                        "description": "Challenge code emailed to user",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",

                    },
                    "404": {
                        "description": "Invalid email and/or code"
                    }
                }
            },
        },
        "/api/verify/phone/{phone}/{code}": {
            "get": {
                "tags": [
                    "verification"
                ],
                "summary": "Verify an {phone, code} combo for authorization or registration",
                "description": "",
                "operationId": "verifyPhone",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "email",
                        "in": "path",
                        "description": "User's email address",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "code",
                        "in": "path",
                        "description": "Challenge code emailed to user",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",

                    },
                    "404": {
                        "description": "Invalid email and/or code"
                    }
                }
            },
        },
    }
};

export default swaggerDefinition;