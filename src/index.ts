import { Hono } from "hono";
import { formatData } from "./responseHelper";

const app = new Hono();
const api = "https://romamobile.it/json/";

app.get("/", async (c) => {
	return c.text(`
  Rome Bus API
  
  Formatting:
  You can add the ?f= or ?format= parameter to change the response format.
  Valid formats are: json, xml, llm (alias for toon), toon

  Endpoints:
  GET /station/[station number]
  GET /search/[query]
  GET /route/[route number]
`);
});

app.get("/station/:id", async (c) => {
	const id = c.req.param("id");

	const payload = {
		jsonrpc: "2.0",
		id: "ID_" + Math.random().toString().replace("0.", ""),
		method: "paline_previsioni",
		params: [id, "it"],
	};

	const response = await fetch(api, {
		method: "POST",
		headers: {
			"Content-Type": "application/json-rpc",
		},
		body: JSON.stringify(payload),
	});

	const data = (await response.json()) as { result: any };

	return formatData(data.result, c);
});

app.get("/search/:query", async (c) => {
	const query = c.req.param("query");

	const payload = {
		jsonrpc: "2.0",
		id: "ID_" + Math.random().toString().replace("0.", ""),
		method: "paline_smart_search",
		params: [query, "it"],
	};

	const response = await fetch(api, {
		method: "POST",
		headers: {
			"Content-Type": "application/json-rpc",
		},
		body: JSON.stringify(payload),
	});

	const data = (await response.json()) as { result: any };

	return formatData(data.result, c);
});

app.get("/route/:id", async (c) => {
	const id = c.req.param("id");

	const payload = {
		jsonrpc: "2.0",
		id: "ID_" + Math.random().toString().replace("0.", ""),
		method: "paline_percorso_fermate",
		params: [id, null, "it"],
	};

	const response = await fetch(api, {
		method: "POST",
		headers: {
			"Content-Type": "application/json-rpc",
		},
		body: JSON.stringify(payload),
	});

	const data = (await response.json()) as { result: any };

	return formatData(data.result, c);
});

export default app;
