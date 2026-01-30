import { Context } from "hono";
import { encode } from "@toon-format/toon";
import convert from "xml-js";

export function formatData(data: any, c: Context) {
	try {
		const format =
			new URL(c.req.url).searchParams.get("f") ||
			new URL(c.req.url).searchParams.get("format") ||
			"json";

		if (format === "json") {
			return c.json(data);
		}

		if (format === "xml") {
			return c.text(convert.json2xml(data, { compact: true }));
		}

		if (format === "llm" || format === "toon") {
			return c.text(encode(data));
		}

		return c.json(data);
	} catch (error) {
		return c.json(
			{
				error: "Formatting failed",
				message: error instanceof Error ? error.message : String(error),
			},
			500,
		);
	}
}
