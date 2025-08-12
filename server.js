const http = require("http");
const quotes = require("./quotes");

const server = http.createServer((req, res) => {
  // Extract URL parts
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Home route
  if (pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
      "Welcome to the Quote API! Visit /quote for a random quote or /quotes for all quotes."
    );

    // Random quote route (optional filter by author)
  } else if (pathname === "/quote") {
    let filteredQuotes = quotes;

    // If ?author=name is provided, filter quotes
    const authorQuery = url.searchParams.get("author");
    if (authorQuery) {
      filteredQuotes = quotes.filter((q) =>
        q.author.toLowerCase().includes(authorQuery.toLowerCase())
      );
    }

    // If no quotes match filter
    if (filteredQuotes.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "No quotes found for the given author." })
      );
    }

    // Pick a random quote from filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(randomQuote));

    // All quotes route
  } else if (pathname === "/quotes") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(quotes));

    // 404 not found
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page not found");
  }
});

// Start server
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
