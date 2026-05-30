erDiagram
        CUSTOMERS ||--o{ ORDERS : "realiza (1:N)"
        PRODUCTS ||--o{ ORDER_ITEMS : "contiene (1:N)"
        ORDERS ||--o{ ORDER_ITEMS : "se divide en (1:N)"

        CUSTOMERS {
            uuid id PK
            varchar name
            varchar email UK
            varchar phone
            timestamp created_at
        }

        PRODUCTS {
            uuid id PK
            varchar sku UK "SKU único para inventario"
            varchar name
            numeric price "¡Nunca float! Guardado como exacto para dinero"
            integer stock ">= 0"
            timestamp created_at
        }

        ORDERS {
            uuid id PK
            uuid customer_id FK
            varchar status "pending | completed | cancelled"
            numeric total_amount "Suma total calculada para auditoría"
            timestamp created_at
        }

        ORDER_ITEMS {
            uuid id PK
            uuid order_id FK
            uuid product_id FK
            integer quantity "> 0"
            numeric unit_price "Snapshot del precio al momento de compra"
        }
