# Conceptual Model — Picnic Island Booking System

This is the conceptual (entity-relationship) model behind the system. It's
derived directly from the working implementation in `prisma/schema.prisma`,
not the aspirational feature list in the brief — every entity and
relationship below has a corresponding table and a working screen in the app.

## Entities

| Entity | What it represents |
|---|---|
| **User** | Anyone with an account — a Visitor, or one of the four staff roles (Hotel, Ferry, Park, Admin). Role is a single field, not a separate table, since a user has exactly one role at a time. |
| **Hotel** | One of the resorts on the island. |
| **Room** | A room type within a hotel (e.g. "Deluxe Lagoon Suite"), with its own price, capacity, and unit count. |
| **HotelBooking** | A visitor's stay in a room for a date range. |
| **FerrySchedule** | A single sailing (route + departure time + capacity). |
| **FerryTicket** | A visitor's booking on a sailing — always tied to one `HotelBooking`, which is what enforces the "ferry tickets require a valid hotel booking" rule from the brief. |
| **ParkEvent** | A ride, show, or beach event, with its own date/time/capacity/price. |
| **ParkBooking** | A visitor's tickets for one `ParkEvent`. |
| **Promotion** | An advertised offer, scoped to Hotel, Park, or the whole site, authored by a staff member or admin. |
| **MapLocation** | A pin on the island map, authored by an admin. |

## Relationships

- A **User** can place many **HotelBooking**s, **FerryTicket**s, and
  **ParkBooking**s (1‑to‑many from User).
- A **Hotel** has many **Room**s; a **Room** has many **HotelBooking**s.
- A **HotelBooking** can have many **FerryTicket**s (a guest may book more
  than one sailing against the same stay), but every **FerryTicket** must
  reference exactly one **HotelBooking** — this foreign key is the
  enforcement mechanism for the ferry/hotel dependency rule.
- A **FerrySchedule** has many **FerryTicket**s.
- A **ParkEvent** has many **ParkBooking**s.
- A **User** (staff/admin) authors many **Promotion**s and **MapLocation**s.

## Diagram

```mermaid
erDiagram
    USER ||--o{ HOTEL_BOOKING : places
    USER ||--o{ FERRY_TICKET : places
    USER ||--o{ PARK_BOOKING : places
    USER ||--o{ PROMOTION : authors
    USER ||--o{ MAP_LOCATION : authors

    HOTEL ||--o{ ROOM : offers
    ROOM ||--o{ HOTEL_BOOKING : "booked as"
    HOTEL_BOOKING ||--o{ FERRY_TICKET : "unlocks"
    FERRY_SCHEDULE ||--o{ FERRY_TICKET : "sold for"
    PARK_EVENT ||--o{ PARK_BOOKING : "booked as"

    USER {
        string id PK
        string name
        string email UK
        string role
    }
    HOTEL {
        string id PK
        string name
        string location
    }
    ROOM {
        string id PK
        string hotelId FK
        string type
        float pricePerNight
        int capacity
    }
    HOTEL_BOOKING {
        string id PK
        string userId FK
        string roomId FK
        datetime checkIn
        datetime checkOut
        string status
    }
    FERRY_SCHEDULE {
        string id PK
        string origin
        string destination
        datetime departureTime
    }
    FERRY_TICKET {
        string id PK
        string userId FK
        string scheduleId FK
        string hotelBookingId FK
        string status
    }
    PARK_EVENT {
        string id PK
        string type
        string name
        datetime date
        int capacity
    }
    PARK_BOOKING {
        string id PK
        string userId FK
        string eventId FK
        int ticketCount
        string status
    }
    PROMOTION {
        string id PK
        string title
        string scope
        boolean active
        string createdById FK
    }
    MAP_LOCATION {
        string id PK
        string name
        string category
        float x
        float y
        string createdById FK
    }
```
