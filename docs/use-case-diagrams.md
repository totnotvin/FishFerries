# Use Case Diagrams — Picnic Island Booking System

These list only use cases that are actually implemented and working in the
app (traceable to a route in `src/app/` and a server action in
`src/lib/actions/`), not the full aspirational list from the assignment
brief. Mermaid has no native UML use-case notation, so each actor is
diagrammed as a flowchart with stadium-shaped nodes standing in for use-case
ovals — the actor/use-case relationships are equivalent to a standard UML
use-case diagram.

## Visitor

| Use case | Implemented in |
|---|---|
| Register / log in / log out | `src/app/register`, `src/app/login`, `src/lib/actions/auth.ts` |
| Book a hotel room | `src/app/hotels/book/[roomId]`, `bookHotelAction` |
| Cancel a hotel booking | `src/app/bookings`, `cancelHotelBookingAction` |
| Book a ferry ticket (requires a confirmed hotel booking) | `src/app/ferry`, `bookFerryAction` |
| Cancel a ferry ticket | `src/app/bookings`, `cancelFerryTicketAction` |
| Book a theme park ride / show / beach event | `src/app/park/book/[eventId]`, `bookParkEventAction` |
| Cancel a park booking | `src/app/bookings`, `cancelParkBookingAction` |
| View all bookings + confirmation/payment screens | `src/app/bookings`, `src/app/bookings/confirmation` |
| View promotions | `src/app/page.tsx` (homepage) |
| View the interactive island map | `src/app/map` |

```mermaid
flowchart LR
    Visitor((Visitor))
    Visitor --> UC1([Register / Log in])
    Visitor --> UC2([Book hotel room])
    Visitor --> UC3([Cancel hotel booking])
    Visitor --> UC4([Book ferry ticket])
    Visitor --> UC5([Cancel ferry ticket])
    Visitor --> UC6([Book ride / show / beach event])
    Visitor --> UC7([Cancel park booking])
    Visitor --> UC8([View my bookings])
    Visitor --> UC9([View promotions])
    Visitor --> UC10([View island map])
    UC4 -. requires .-> UC2
```

## Hotel Staff

```mermaid
flowchart LR
    HotelStaff((Hotel Staff))
    HotelStaff --> H1([Add / edit / delete room])
    HotelStaff --> H2([Confirm / cancel any hotel booking])
    HotelStaff --> H3([View booking reports & revenue])
    HotelStaff --> H4([Create hotel promotion])
    HotelStaff --> H5([Activate / deactivate promotion])
```

## Ferry Staff

```mermaid
flowchart LR
    FerryStaff((Ferry Staff))
    FerryStaff --> F1([Add / delete ferry schedule])
    FerryStaff --> F2([Validate a ferry ticket by ID])
    FerryStaff --> F3([Cancel any ferry ticket])
    FerryStaff --> F4([View passenger list & trip reports])
```

## Theme Park Staff

```mermaid
flowchart LR
    ParkStaff((Theme Park Staff))
    ParkStaff --> P1([Create / edit / delete event])
    ParkStaff --> P2([Validate an on-site booking by ID])
    ParkStaff --> P3([Cancel any park booking])
    ParkStaff --> P4([View ticket sales & visitor reports])
    ParkStaff --> P5([Create park promotion])
    ParkStaff --> P6([Activate / deactivate promotion])
```

## Admin

```mermaid
flowchart LR
    Admin((Admin))
    Admin --> A1([Change a user's role])
    Admin --> A2([Delete a user])
    Admin --> A3([Create / delete general promotion])
    Admin --> A4([Create / delete map location])
    Admin --> A5([View system-wide reports: users, revenue, passengers])
```
