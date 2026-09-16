import { db } from "@/lib/db";

const products = [
  ["Konga Sun Dried", 22, "Ethiopia", "Light", "Blueberry · jasmine · cacao", "Natural", 7, "Morrow Coffee", 1],
  ["La Palma Gesha", 28, "Colombia", "Light", "Bergamot · peach · honey", "Washed", 5, "Altura Lab", 1],
  ["Kerinci Valley", 19, "Indonesia", "Medium", "Cedar · plum · brown sugar", "Honey", 12, "Common Ground", 1],
  ["Nariño Reserve", 21, "Colombia", "Medium", "Caramel · red apple · cocoa", "Washed", 3, "Fieldwork Roasters", 1],
  ["Guji Moon", 23, "Ethiopia", "Light", "Strawberry · hibiscus · vanilla", "Natural", 9, "Morrow Coffee", 0],
  ["Sumatra Lintong", 18, "Indonesia", "Dark", "Dark chocolate · clove · molasses", "Wet hulled", 14, "Common Ground", 0],
  ["Huila Night Decaf", 20, "Colombia", "Medium", "Toffee · orange · almond", "Sugarcane decaf", 8, "Altura Lab", 0],
  ["Sidama Ardi", 24, "Ethiopia", "Light", "Lemon · black tea · apricot", "Washed", 2, "Fieldwork Roasters", 0],
  ["Java Ijen", 19, "Indonesia", "Dark", "Tobacco · cocoa nib · spice", "Natural", 11, "Morrow Coffee", 0]
];

async function prepare() {
  await db.execute(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price REAL NOT NULL,
    origin TEXT NOT NULL, roast TEXT NOT NULL, tasting_notes TEXT NOT NULL,
    process TEXT NOT NULL, stock INTEGER NOT NULL, roaster TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT (datetime('now'))
  )`);
  const count = await db.execute("SELECT COUNT(*) AS total FROM products");
  if (Number(count.rows[0].total) === 0) {
    for (const product of products) {
      await db.execute({
        sql: "INSERT INTO products (name, price, origin, roast, tasting_notes, process, stock, roaster, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: product,
      });
    }
  }
}

export async function GET() {
  await prepare();
  const { rows } = await db.execute("SELECT * FROM products ORDER BY featured DESC, id ASC");
  return Response.json(rows);
}

export async function POST(req: Request) {
  await prepare();
  const body = await req.json();
  await db.execute({
    sql: "INSERT INTO products (name, price, origin, roast, tasting_notes, process, stock, roaster, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [body.name, body.price, body.origin, body.roast, body.tasting_notes, body.process, body.stock, body.roaster, body.featured ? 1 : 0],
  });
  return Response.json({ ok: true }, { status: 201 });
}
