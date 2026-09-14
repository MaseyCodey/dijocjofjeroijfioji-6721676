# ☀️ Mase Day Art Store

A cute, responsive pink-and-sun-themed storefront for digital art and future physical posters. It is plain HTML, CSS, and JavaScript, so it works on GitHub Pages without a build command.

## Publish it free with GitHub Pages

1. Open this repository on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose branch **main**, folder **/ (root)**, then press **Save**.
5. GitHub will show the public website link after a minute or two.

To download the project: open the repository’s **Code** menu and choose **Download ZIP**.

## Important setup

Open `config.js` and change:

- `ADMIN_PIN`: change the sample PIN before publishing.
- `GOOGLE_CLIENT_ID`: a Google OAuth Web Client ID enables real Google Sign-In.
- `STRIPE_PAYMENT_LINK`: paste a Stripe Payment Link to send checkout to Stripe.
- `STORE_EMAIL`: your customer-contact email.

Never add Stripe secret keys, passwords, or private API keys to this repository. GitHub Pages files are public.

## What works now

- Responsive pink Mase Day design
- Digital and physical product filters
- Shopping bag with quantities and totals
- Physical checkout requires email and shipping address
- Digital-only checkout requires email
- Browser address autofill plus demonstration address suggestions
- Demo Google-style account mode
- Local past-order history
- Hidden admin shortcut (small ✦ at bottom left)
- Admin can add, edit, delete, and choose digital/physical listings
- Products and cart stay saved in the visitor’s browser

## What needs a service before real sales

GitHub Pages is a static host. These features require outside services:

- **Payments:** Stripe Payment Links are the simplest option.
- **Real user accounts and shared order history:** use Supabase or Firebase.
- **Google login:** create an OAuth Web Client ID in Google Cloud and add the GitHub Pages URL as an authorized origin.
- **Real address autocomplete:** use Google Places, Mapbox Search, or Geoapify.
- **Protected admin:** a PIN in public JavaScript is not secure. For a real admin database, use Supabase/Firebase authentication.

The current admin stores products only in that browser. It is ideal for designing and testing listings, but it does not publish edits to every shopper.

## Custom domain

You can use `masey.space` without paying for another domain. In GitHub Pages settings, enter the domain you want (for example, `shop.masey.space`) and add the DNS record GitHub displays at your domain provider.

## Files

- `index.html` — store layout
- `styles.css` — full visual design
- `app.js` — products, cart, account, checkout, and admin
- `config.js` — easy service configuration

Made for Mase Day.
