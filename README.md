# Disaster Assistant

A React prototype that explores earthquake monitoring, a knowledge base, and conversational assistance. It reads recent earthquakes from the [USGS GeoJSON feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).

**[Try the public information demo](https://aidan-projects.nuttyoak11.chatgpt.site/demo/disaster.html).** The portfolio demo reads the USGS feed and uses fixed, source-linked safety answers. It is separate from this Firebase prototype and does not require an account or API key.

## Run locally

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in your own Firebase project configuration.
3. Configure Firebase Authentication and restrictive Firestore security rules for your own project.
4. Run `npm start`.

The browser Firebase configuration identifies a project; it does not replace Firestore rules. Never place a provider secret in a `REACT_APP_*` variable, because Create React App embeds those values in the public browser bundle. The project uses fixed local answers instead of a browser-side AI API key.

## Scope and safety

This is a learning prototype. Its earthquake data and guidance are informational, not an emergency alert system. Follow local emergency authorities for urgent help. Review all authentication and database rules before connecting it to a public Firebase project.
