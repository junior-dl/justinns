// Fictional demo data. Every lodging, address, person and review here is invented.
export type SeedRoomType = { name: string; bed: string; sizeSqm: number; maxPersons: number; price: number; description: string; rooms: number };
export type SeedLodging = {
  slug: string; name: string; type: "hotel" | "inn" | "pension"; city: string; address: string; tagline: string;
  description: string; amenities: string[]; checkIn: string; checkOut: string; palette: number; roomTypes: SeedRoomType[];
};

export const lodgings: SeedLodging[] = [
  {
    slug: "saltmarsh-grand-hotel", name: "Saltmarsh Grand Hotel", type: "hotel", city: "Dumaguete",
    address: "88 Calle Marimar, Bantayan Shore", tagline: "Bay-view rooms a short walk from the boulevard",
    description: "A seven-storey hotel facing the bay, with a rooftop pool, a breakfast hall that opens at six, and staff who will happily book your boat to the reef.\n\nRooms on the upper floors look straight out over the water; the garden wing is quieter and a little cheaper.",
    amenities: ["Rooftop pool", "Free Wi-Fi", "Breakfast buffet", "Airport shuttle", "Fitness room", "24-hour front desk"],
    checkIn: "14:00", checkOut: "12:00", palette: 0,
    roomTypes: [
      { name: "Garden Queen", bed: "1 queen bed", sizeSqm: 24, maxPersons: 2, price: 3600, rooms: 5, description: "Ground-floor room opening onto the frangipani garden." },
      { name: "Bay View Deluxe", bed: "1 king bed", sizeSqm: 30, maxPersons: 3, price: 5200, rooms: 4, description: "Upper-floor room with a balcony over the bay." },
      { name: "Marimar Family Suite", bed: "1 king + 2 single beds", sizeSqm: 48, maxPersons: 5, price: 8400, rooms: 2, description: "Two rooms and a sitting area; sleeps a family of five." },
    ],
  },
  {
    slug: "capiztrana-tower-hotel", name: "Capiztrana Tower Hotel", type: "hotel", city: "Iloilo City",
    address: "1200 Avenida Lumbang, Mandurriao", tagline: "Business-ready rooms above the river esplanade",
    description: "Shell-screen windows, a long marble lobby and a twenty-metre lap pool. Capiztrana is built for business trips but generous enough for a weekend away.\n\nThe esplanade is across the road, and the food park downstairs runs late.",
    amenities: ["Lap pool", "Free Wi-Fi", "Meeting rooms", "Restaurant & bar", "Parking", "Laundry service"],
    checkIn: "15:00", checkOut: "12:00", palette: 1,
    roomTypes: [
      { name: "Executive Twin", bed: "2 single beds", sizeSqm: 26, maxPersons: 2, price: 4100, rooms: 5, description: "Two beds, a proper desk and a river-side window." },
      { name: "Executive King", bed: "1 king bed", sizeSqm: 28, maxPersons: 2, price: 4500, rooms: 4, description: "Corner room with floor-to-ceiling glass." },
      { name: "Lumbang Suite", bed: "1 king bed + sofa bed", sizeSqm: 52, maxPersons: 4, price: 9200, rooms: 2, description: "Separate living room, soaking tub and lounge access." },
    ],
  },
  {
    slug: "harbor-lumen-hotel", name: "Harbor Lumen Hotel", type: "hotel", city: "Cebu City",
    address: "17 Pier Lantern Road, Pasil", tagline: "Port-side hotel with a sky deck",
    description: "A glassy tower near the old port. Watch the ferries come in from the sky deck, then take the free shuttle to the malls and the heritage district.\n\nPet-friendly rooms are available on the third floor.",
    amenities: ["Sky deck", "Free Wi-Fi", "Shuttle service", "Pet-friendly rooms", "Spa", "Room service"],
    checkIn: "14:00", checkOut: "11:00", palette: 2,
    roomTypes: [
      { name: "Lantern Standard", bed: "1 double bed", sizeSqm: 20, maxPersons: 2, price: 3200, rooms: 6, description: "Compact and bright, with blackout curtains." },
      { name: "Harbor Premier", bed: "1 king bed", sizeSqm: 32, maxPersons: 3, price: 5600, rooms: 4, description: "Faces the port; includes breakfast for two." },
      { name: "Sky Loft", bed: "1 king bed", sizeSqm: 55, maxPersons: 4, price: 9800, rooms: 2, description: "Top-floor loft with a private terrace." },
    ],
  },
  {
    slug: "lantaw-cove-resort-hotel", name: "Lantaw Cove Resort Hotel", type: "hotel", city: "Puerto Princesa",
    address: "Purok Bituin, Sabang Coastal Road", tagline: "Cliffside resort hotel above a quiet cove",
    description: "Low white buildings stepping down to a private cove. Mornings are for kayaks, afternoons for the infinity pool, evenings for grilled fish on the deck.\n\nThe resort runs on solar power during the day.",
    amenities: ["Infinity pool", "Private beach", "Kayaks", "Restaurant", "Free Wi-Fi in lobby", "Tour desk"],
    checkIn: "14:00", checkOut: "12:00", palette: 3,
    roomTypes: [
      { name: "Hillside Room", bed: "1 queen bed", sizeSqm: 26, maxPersons: 2, price: 4800, rooms: 4, description: "Shaded room among the trees, a minute from the pool." },
      { name: "Cove View Room", bed: "1 king bed", sizeSqm: 30, maxPersons: 3, price: 6400, rooms: 4, description: "Wide windows over the cove." },
      { name: "Beachfront Villa", bed: "1 king + 1 double bed", sizeSqm: 60, maxPersons: 5, price: 11500, rooms: 2, description: "Steps from the sand, with an outdoor shower." },
    ],
  },
  {
    slug: "mangrove-lane-inn", name: "Mangrove Lane Inn", type: "inn", city: "Siquijor",
    address: "Sitio Bakawan, Coastal Barangay Road", tagline: "A twelve-room inn by the mangrove boardwalk",
    description: "Wooden balconies, hammocks, and a boardwalk through the mangroves that ends at a swimming spot. The owners rent scooters and draw you a map of the waterfalls.\n\nBreakfast is cooked to order.",
    amenities: ["Breakfast included", "Scooter rental", "Hammock garden", "Free Wi-Fi", "Bicycle rental"],
    checkIn: "13:00", checkOut: "11:00", palette: 4,
    roomTypes: [
      { name: "Bakawan Double", bed: "1 double bed", sizeSqm: 18, maxPersons: 2, price: 2100, rooms: 5, description: "Fan-cooled room with a balcony hammock." },
      { name: "Boardwalk Twin", bed: "2 single beds", sizeSqm: 20, maxPersons: 2, price: 2300, rooms: 4, description: "Air-conditioned twin facing the boardwalk." },
      { name: "Loft Family Room", bed: "1 double + 2 single beds", sizeSqm: 32, maxPersons: 4, price: 3600, rooms: 2, description: "Split-level room under the roof." },
    ],
  },
  {
    slug: "wandering-gecko-inn", name: "The Wandering Gecko Inn", type: "inn", city: "Tagbilaran",
    address: "45 Daang Alitaptap, Dao District", tagline: "Friendly inn for island hoppers",
    description: "Bright rooms around a courtyard with a mango tree. The front desk sells tour tickets at cost and keeps a shelf of borrowable snorkels.\n\nTen minutes from the port by tricycle.",
    amenities: ["Courtyard café", "Free Wi-Fi", "Tour booking", "Luggage storage", "Snorkel library"],
    checkIn: "14:00", checkOut: "11:00", palette: 5,
    roomTypes: [
      { name: "Gecko Single", bed: "1 single bed", sizeSqm: 12, maxPersons: 1, price: 1400, rooms: 4, description: "Small, spotless, perfect for solo travellers." },
      { name: "Courtyard Double", bed: "1 double bed", sizeSqm: 18, maxPersons: 2, price: 2200, rooms: 5, description: "Opens onto the courtyard and the mango tree." },
      { name: "Island Hopper Quad", bed: "2 bunk beds", sizeSqm: 24, maxPersons: 4, price: 3200, rooms: 2, description: "Two bunks for groups and friends." },
    ],
  },
  {
    slug: "kalachuchi-courtyard-inn", name: "Kalachuchi Courtyard Inn", type: "inn", city: "Vigan",
    address: "9 Calle Hinablon, Heritage Quarter", tagline: "Restored ancestral house with capiz windows",
    description: "A restored two-storey house with narra floors and sliding capiz windows, one street from the cobblestones. Calesa rides leave from the corner.\n\nThe courtyard serves empanada until midnight.",
    amenities: ["Heritage building", "Free Wi-Fi", "Courtyard dining", "Bike rental", "Air conditioning"],
    checkIn: "14:00", checkOut: "12:00", palette: 6,
    roomTypes: [
      { name: "Capiz Window Room", bed: "1 queen bed", sizeSqm: 22, maxPersons: 2, price: 2800, rooms: 4, description: "Original capiz shell windows over the street." },
      { name: "Azotea Twin", bed: "2 single beds", sizeSqm: 22, maxPersons: 2, price: 2900, rooms: 3, description: "Opens onto the rooftop azotea." },
      { name: "Ancestral Suite", bed: "1 four-poster king bed", sizeSqm: 38, maxPersons: 3, price: 4400, rooms: 1, description: "The old master bedroom, with period furniture." },
    ],
  },
  {
    slug: "pinewood-ridge-inn", name: "Pinewood Ridge Inn", type: "inn", city: "Baguio",
    address: "3 Ridgeway Lane, Upper Pinecrest", tagline: "Cozy hillside inn with a fireplace lounge",
    description: "Pine-panelled rooms, thick blankets and a fireplace lounge that smells of coffee and woodsmoke. On clear mornings you can see the valley from the deck.\n\nIt gets cold at night — heaters are in every room.",
    amenities: ["Fireplace lounge", "Heaters in rooms", "Free Wi-Fi", "Parking", "Coffee bar"],
    checkIn: "14:00", checkOut: "12:00", palette: 7,
    roomTypes: [
      { name: "Pine Double", bed: "1 double bed", sizeSqm: 18, maxPersons: 2, price: 2400, rooms: 5, description: "Wood-panelled room with a valley window." },
      { name: "Ridge Twin", bed: "2 single beds", sizeSqm: 20, maxPersons: 2, price: 2500, rooms: 3, description: "Two beds and a reading nook." },
      { name: "Fireside Family Room", bed: "1 queen + 2 single beds", sizeSqm: 34, maxPersons: 4, price: 4200, rooms: 2, description: "Biggest room in the house, by the lounge." },
    ],
  },
  {
    slug: "casa-abaniko-pension", name: "Casa Abaniko Pension", type: "pension", city: "Dumaguete",
    address: "21 Kalye Abaniko, Piapi", tagline: "Simple rooms near the university belt",
    description: "Clean, quiet rooms on a leafy street, five minutes from the university and the night market. Long-stay rates on request.\n\nShared kitchen on the ground floor.",
    amenities: ["Shared kitchen", "Free Wi-Fi", "Air conditioning", "Laundry area"],
    checkIn: "13:00", checkOut: "11:00", palette: 8,
    roomTypes: [
      { name: "Standard Single", bed: "1 single bed", sizeSqm: 10, maxPersons: 1, price: 850, rooms: 5, description: "Compact air-conditioned single." },
      { name: "Standard Double", bed: "1 double bed", sizeSqm: 14, maxPersons: 2, price: 1250, rooms: 5, description: "Double room with a private bathroom." },
      { name: "Abaniko Triple", bed: "1 double + 1 single bed", sizeSqm: 18, maxPersons: 3, price: 1650, rooms: 2, description: "Room for three, with a small balcony." },
    ],
  },
  {
    slug: "dalisay-pension-house", name: "Dalisay Pension House", type: "pension", city: "Bacolod",
    address: "102 Lacson Ilaya Extension", tagline: "Budget stay close to the inasal strip",
    description: "A tidy three-storey pension house with hot showers and a rooftop where guests share sweets from the bakery next door.\n\nThe chicken inasal strip is a short walk away.",
    amenities: ["Hot showers", "Free Wi-Fi", "Rooftop lounge", "24-hour desk"],
    checkIn: "14:00", checkOut: "12:00", palette: 9,
    roomTypes: [
      { name: "Fan Room", bed: "1 double bed", sizeSqm: 12, maxPersons: 2, price: 750, rooms: 4, description: "Fan-cooled double, the best price in the house." },
      { name: "Aircon Double", bed: "1 double bed", sizeSqm: 14, maxPersons: 2, price: 1150, rooms: 5, description: "Air-conditioned with a private bathroom." },
      { name: "Barkada Room", bed: "2 double beds", sizeSqm: 22, maxPersons: 4, price: 1800, rooms: 2, description: "Two doubles for a group of friends." },
    ],
  },
  {
    slug: "tres-marias-pension", name: "Tres Marias Pension", type: "pension", city: "Davao City",
    address: "56 Durian Grove Street, Obrero", tagline: "Family-run pension with a fruit stand",
    description: "Run by three sisters, Tres Marias has a small fruit stand at the gate and a breakfast of rice, eggs and whatever is in season.\n\nThe airport is twenty minutes away by taxi.",
    amenities: ["Breakfast available", "Free Wi-Fi", "Air conditioning", "Airport transfers"],
    checkIn: "14:00", checkOut: "12:00", palette: 10,
    roomTypes: [
      { name: "Maria Single", bed: "1 single bed", sizeSqm: 11, maxPersons: 1, price: 900, rooms: 3, description: "Quiet single at the back of the house." },
      { name: "Maria Double", bed: "1 queen bed", sizeSqm: 16, maxPersons: 2, price: 1400, rooms: 4, description: "Queen bed, mini fridge and a garden view." },
      { name: "Sisters' Family Room", bed: "1 queen + 2 single beds", sizeSqm: 24, maxPersons: 4, price: 2100, rooms: 2, description: "Connected rooms for families." },
    ],
  },
  {
    slug: "bayabas-street-pension", name: "Bayabas Street Pension", type: "pension", city: "Iloilo City",
    address: "7 Bayabas Street, Jaro", tagline: "Old-town pension by the belfry",
    description: "A converted townhouse near the cathedral belfry. Rooms are small but bright, and the café downstairs makes a mean batchoy.\n\nGood base for a church-and-food day in Jaro.",
    amenities: ["Café downstairs", "Free Wi-Fi", "Air conditioning", "Luggage storage"],
    checkIn: "13:00", checkOut: "11:00", palette: 11,
    roomTypes: [
      { name: "Belfry Single", bed: "1 single bed", sizeSqm: 10, maxPersons: 1, price: 800, rooms: 3, description: "Single with a view of the bell tower." },
      { name: "Townhouse Double", bed: "1 double bed", sizeSqm: 15, maxPersons: 2, price: 1200, rooms: 5, description: "Bright double with tiled floors." },
      { name: "Townhouse Twin", bed: "2 single beds", sizeSqm: 16, maxPersons: 2, price: 1300, rooms: 3, description: "Two beds, a desk and a window seat." },
    ],
  },
];

export const discounts = [
  { code: "WELCOME10", percentOff: 10, description: "10% off your first JustInns stay." },
  { code: "STAYLONGER15", percentOff: 15, description: "15% off any booking — try it on a long weekend." },
  { code: "ISLAND20", percentOff: 20, description: "20% off for island hoppers. Demo code, no limits." },
];

export const demoPassword = "justinns-demo";
export const users = [
  { id: "u_admin", name: "Ada Admin", email: "admin@justinns.test", role: "admin", phone: "0900 000 0001" },
  { id: "u_guest", name: "Gabi Guest", email: "guest@justinns.test", role: "guest", phone: "0900 000 0002" },
  { id: "u_r1", name: "Lio Santos", email: "lio@example.test", role: "guest", phone: null },
  { id: "u_r2", name: "Mara Villanueva", email: "mara@example.test", role: "guest", phone: null },
  { id: "u_r3", name: "Paolo Ilagan", email: "paolo@example.test", role: "guest", phone: null },
  { id: "u_r4", name: "Bea Montecillo", email: "bea@example.test", role: "guest", phone: null },
  { id: "u_r5", name: "Tomas Reyes", email: "tomas@example.test", role: "guest", phone: null },
  { id: "u_r6", name: "Ines Dumalag", email: "ines@example.test", role: "guest", phone: null },
];

export const reviewTemplates = [
  { rating: 5, title: "Would stay again", comment: "Clean room, kind staff and everything worked. Exactly what we needed after a long day out." },
  { rating: 4, title: "Great location", comment: "Walkable to almost everything. The room was a bit small but spotless and quiet at night." },
  { rating: 5, title: "Best breakfast of the trip", comment: "Hot food, strong coffee and staff who remembered how we liked our eggs on day two." },
  { rating: 4, title: "Comfortable and calm", comment: "Good beds and reliable Wi-Fi. Check-in took a few minutes longer than expected, otherwise lovely." },
  { rating: 3, title: "Fine for a short stay", comment: "Does the job. Air-con was loud, but the price was fair and the front desk sorted our tour." },
  { rating: 5, title: "Felt looked after", comment: "They held our bags after check-out and pointed us to a great place for dinner. Small touches matter." },
];
