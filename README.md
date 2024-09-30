<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Global Art AI Documentation</title>
</head>
<body>

<div style="display: flex; align-items: center; justify-content: center">
<img width="50%" src="https://global-dev.creoad.kz/_nuxt/BuyerHorBlack.CjhFCJpW.svg">
</div>
<h1>Global Art AI</h1>
<p><strong>Global Art AI</strong> is a web platform built using Nuxt 3, designed to showcase and manage artworks and artists. It leverages technologies such as TailwindCSS for styling, Google Maps integration, and provides features like dynamic routing, internationalization, and real-time updates.</p>

<h2>Tech Stack</h2>
<ul>
  <li><strong>Framework:</strong> Nuxt 3</li>
  <li><strong>Styling:</strong> TailwindCSS + TailwindUI</li>
  <li><strong>State Management:</strong> Pinia</li>
  <li><strong>Internationalization:</strong> Nuxt i18n</li>
  <li><strong>Form Validation:</strong> Vuelidate</li>
  <li><strong>Icons:</strong> Heroicons via HeadlessUI</li>
  <li><strong>Real-time Updates:</strong> Socket.io</li>
  <li><strong>HTTP Requests:</strong> Axios</li>
  <li><strong>Process Manager:</strong> PM2</li>
  <li><strong>Animations:</strong> Anime.js</li>
  <li><strong>Geolocation:</strong> Google Maps API</li>
  <li><strong>Package Manager:</strong> Bun</li>
</ul>

<h2>Features</h2>
<ul>
  <li><strong>Dynamic Routes:</strong> Automatically generated routes for artworks and artists.</li>
  <li><strong>Internationalization:</strong> Support for multiple languages (e.g., English, Russian, Korean, etc.).</li>
  <li><strong>Real-time Updates:</strong> Integration with Socket.io for real-time data sync.</li>
  <li><strong>Google Sign-In:</strong> OAuth-based authentication via Google.</li>
  <li><strong>SEO Optimization:</strong> Pre-rendered pages and sitemap generation.</li>
</ul>

<h2>Project Structure</h2>
<pre>
/assets
  /css
    style.css  # Custom styles
    fonts.css  # Custom fonts
/components   # Vue components
/composables   # Reusable logic
/locales      # i18n translations
/pages        # Nuxt pages
/plugins      # Nuxt plugins
/store        # Pinia stores
</pre>

<h2>Installation & Setup</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js (v16.x or above)</li>
  <li>Bun</li>
</ul>

<h3>Steps</h3>

<p><strong>Clone the repository:</strong></p>
<pre><code>git clone https://github.com/your-repo/global-art-ai.git
cd global-art-ai
</code></pre>

<p><strong>Install dependencies:</strong></p>
<pre><code>bun install</code></pre>

<p><strong>Run the development server:</strong></p>
<pre><code>bun dev</code></pre>

<h2>Build & Deployment</h2>

<p><strong>To build the project for production:</strong></p>
<pre><code>bun build</code></pre>

<p><strong>To preview the production build locally:</strong></p>
<pre><code>bun preview</code></pre>

<h2>PM2 Configuration</h2>

<p>PM2 is used for managing the production processes of the application. The PM2 configuration is stored in <strong>ecosystem.config.cjs</strong>.</p>

<h3>Example setup:</h3>
<pre><code>module.exports = {
  apps: [
    {
      name: 'GlobalArtAI',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};
</code></pre>

<p><strong>Start the application with:</strong></p>
<pre><code>pm2 start ecosystem.config.cjs</code></pre>

<p><strong>Monitor PM2:</strong></p>
<pre><code>pm2 monit</code></pre>

<p><strong>Stop the application:</strong></p>
<pre><code>pm2 stop GlobalArtAI</code></pre>

<h2>Environment Variables</h2>

<p>Create a <strong>.env</strong> file with the following variables:</p>
<pre><code>GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NUXT_PUBLIC_SITE_URL=https://globalart.ai
YANDEX_METRIKA_ID=your-yandex-metrika-id
</code></pre>

<h2>TailwindCSS Configuration</h2>
<p>TailwindCSS is configured in the <strong>tailwind.config.js</strong> file, and custom styles can be added in <strong>assets/css/style.css</strong>.</p>

<h2>Figma Design</h2>
<p>The project design can be found on Figma:</p>
<p><strong>Figma Design - Global Art AI</strong></p>

<h2>Dynamic Routes</h2>
<p>Dynamic routes are generated for artworks and artists based on data fetched from the API.</p>

<h3>Example code for generating artwork routes:</h3>
<pre><code>async function getArtworksRoutes() {
  const { data } = await axios.post('https://api-dev.globalart.ai/api/art/art-item/list-art-items/', {...})
  return data.data.objects_list.map(artwork => `/artworks/${artwork.id}`)
}
</code></pre>

<h2>Internationalization (i18n)</h2>
<p>The project supports multiple languages, with the default being English (en-US). The locales are loaded lazily from the <strong>locales/</strong> directory.</p>

<p><strong>Supported languages:</strong></p>
<ul>
  <li>English</li>
  <li>Russian</li>
  <li>Korean</li>
  <li>Kazakh</li>
  <li>Turkish</li>
  <li>Chinese</li>
  <li>Japanese</li>
  <li>Arabic</li>
  <li>Spanish</li>
  <li>French</li>
  <li>German</li>
</ul>

<h2>Plugins</h2>
<ul>
  <li><strong>Maska:</strong> Input masking for form fields.</li>
  <li><strong>Vue3-Toastify:</strong> For toast notifications across the app.</li>
</ul>

<h2>Testing & Debugging</h2>
<ul>
  <li><strong>Nuxt Devtools:</strong> Enabled in development mode for debugging.</li>
  <li><strong>Lighthouse Audits:</strong> Perform regular audits with Google Lighthouse for performance, accessibility, and SEO improvements.</li>
</ul>

</body>
</html>
