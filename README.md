# HydroGuard

HydroGuard is a flood-risk alert and emergency support platform that helps communities monitor flood danger, receive instant warnings, and access critical safety information. It combines predictive flood scoring, alert subscriptions, safe-zone guidance, emergency contacts, and community reporting.

## Features

- Flood risk detection with model confidence scoring.
- SMS alerts for high flood risk.
- WhatsApp alerts with map links.
- Safe zones map and evacuation routes.
- Emergency contacts for police, ambulance, and flood hotlines.
- Community flood reports with moderation workflow.
- Location-aware warnings and forecast indicators.
- Secure authentication and access control.

## Data Sources

HydroGuard uses and combines public environmental and weather data sources, including:

- SAWS
- DWS
- NASA POWER
- GPM
- ESA CCI

## Security

HydroGuard is designed with security and privacy in mind:

- HTTPS-only communication.
- HttpOnly, Secure, SameSite=Strict cookies.
- Session regeneration on login.
- Role-based access control for residents, moderators, and admins.
- Password hashing using bcrypt or argon2.
- Sensitive data encryption at rest.
- Server-side validation and rate limiting.
- Audit logs for reports, moderation, and login activity.
- POPIA-compliant data handling.

## Alerts

Users can subscribe to:
- SMS flood alerts.
- WhatsApp broadcast alerts.

## Emergency Contacts

HydroGuard includes quick access to:
- Police emergency line.
- Ambulance / medical emergency line.
- Flood hotline.
- City of Tshwane contacts.

## Version

- `1.0.0`

## Status

Current interface includes:
- Flood probability display.
- Model confidence indicators.
- Rainfall, water level, and soil moisture metrics.
- Map view placeholder.
- Past flood reports and sensor data placeholder.

## Access

Users must log in to use HydroGuard. An account is required to check flood risk and submit reports.

## License

Add your preferred license here.

## Contributing

Add contribution guidelines here if you want the project open to collaborators.
