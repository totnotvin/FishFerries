# Data Dictionary — Picnic Island Booking System

Generated directly from `prisma/schema.prisma`. Types are Prisma types
(`String` maps to SQLite `TEXT`, `Float` to `REAL`, `Int` to `INTEGER`,
`DateTime` to `TEXT` (ISO‑8601), `Boolean` to `INTEGER`).

## Enums

| Enum | Values |
|---|---|
| `Role` | `VISITOR`, `HOTEL_STAFF`, `FERRY_STAFF`, `PARK_STAFF`, `ADMIN` |
| `BookingStatus` | `PENDING`, `CONFIRMED`, `CANCELLED` |
| `ParkEventType` | `RIDE`, `SHOW`, `BEACH_EVENT` |
| `PromotionScope` | `HOTEL`, `PARK`, `GENERAL` |

## User

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK, default `cuid()` | Unique identifier |
| name | String | required | Display name |
| email | String | unique, required | Login identifier |
| passwordHash | String | required | bcrypt hash — plaintext password never stored |
| role | Role | default `VISITOR` | Determines which dashboards/actions are available |
| createdAt | DateTime | default `now()` | Account creation timestamp |

## Hotel

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| name | String | required | Hotel name |
| description | String | required | Short marketing description |
| location | String | required | Where on the island |

## Room

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| hotelId | String | FK → Hotel.id, cascade delete | Owning hotel |
| type | String | required | Room type label, e.g. "Deluxe Lagoon Suite" |
| pricePerNight | Float | required | Price in USD |
| capacity | Int | required | Max guests per unit |
| totalUnits | Int | default 5 | Number of physical units of this room type |

## HotelBooking

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| userId | String | FK → User.id, cascade delete | Guest |
| roomId | String | FK → Room.id, cascade delete | Room booked |
| checkIn | DateTime | required | Stay start |
| checkOut | DateTime | required | Stay end |
| guests | Int | required | Number of guests |
| status | BookingStatus | default `CONFIRMED` | Booking lifecycle state |
| totalPrice | Float | required | Total charged (mock payment) |
| createdAt | DateTime | default `now()` | Booking timestamp |

## FerrySchedule

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| origin | String | required | Departure point |
| destination | String | required | Arrival point |
| departureTime | DateTime | required | Sailing time |
| capacity | Int | default 50 | Max passengers |

## FerryTicket

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier — also the "ferry pass" reference shown to the passenger |
| userId | String | FK → User.id, cascade delete | Passenger |
| scheduleId | String | FK → FerrySchedule.id, cascade delete | Sailing booked |
| hotelBookingId | String | FK → HotelBooking.id, cascade delete, **required** | Enforces "ferry requires a valid hotel booking" |
| passengers | Int | default 1 | Passenger count |
| status | BookingStatus | default `CONFIRMED` | Booking lifecycle state |
| issuedAt | DateTime | default `now()` | Issue timestamp |

## ParkEvent

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| type | ParkEventType | required | RIDE / SHOW / BEACH_EVENT |
| name | String | required | Event name |
| description | String | required | Short description |
| date | DateTime | required | Event date |
| time | String | required | Free-text time, e.g. "14:00" |
| capacity | Int | required | Max tickets |
| price | Float | required | Price per ticket (0 = free) |

## ParkBooking

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier — used as the on-site validation reference |
| userId | String | FK → User.id, cascade delete | Ticket holder |
| eventId | String | FK → ParkEvent.id, cascade delete | Event booked |
| ticketCount | Int | default 1 | Number of tickets |
| status | BookingStatus | default `CONFIRMED` | Booking lifecycle state |
| createdAt | DateTime | default `now()` | Booking timestamp |

## Promotion

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| title | String | required | Headline |
| description | String | required | Body text |
| imageEmoji | String | default 🎉 | Admin/staff-chosen emoji shown on the promo card |
| scope | PromotionScope | default `GENERAL` | Where it's shown (Hotel / Park / homepage) |
| active | Boolean | default true | Whether it's currently displayed |
| createdById | String | FK → User.id, cascade delete | Author (staff/admin) |
| createdAt | DateTime | default `now()` | Creation timestamp |

## MapLocation

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | String | PK | Unique identifier |
| name | String | required | Location name |
| description | String | required | Shown in the map popup |
| category | String | required | Hotel / Ferry / Theme Park / Beach / Dining / Other |
| x | Float | required | Horizontal position, 0–100 (% of map width) |
| y | Float | required | Vertical position, 0–100 (% of map height) |
| createdById | String | FK → User.id, cascade delete | Author (admin) |
| createdAt | DateTime | default `now()` | Creation timestamp |
