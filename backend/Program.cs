var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Grundläggande konfiguration av HTTP-pipelinen
app.UseHttpsRedirection();

// Servera statiska filer från projektroten (HTML, CSS, JS, bilder)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..")),
    RequestPath = ""
});

// Använd index.html som startsida
app.UseDefaultFiles();

app.UseRouting();

// Enkel server-side hantering av kontaktformuläret
app.MapPost("/contact", async (HttpContext context) =>
{
    var form = await context.Request.ReadFormAsync();
    var name = form["name"].ToString().Trim();
    var email = form["email"].ToString().Trim();
    var message = form["message"].ToString().Trim();

    // Enkel server-side validering (krav: alla fält måste vara ifyllda)
    if (string.IsNullOrWhiteSpace(name) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(message))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.WriteAsync(@$"
<!DOCTYPE html>
<html lang=""sv"">
<head>
    <meta charset=""UTF-8"">
    <title>Kontaktformulär - fel</title>
    <link rel=""stylesheet"" href=""/css/style.css"">
</head>
<body>
    <main class=""container"">
        <h1>Formuläret är inte komplett</h1>
        <p>Fyll i <strong>namn</strong>, <strong>e-post</strong> och <strong>meddelande</strong> och försök igen.</p>
        <a href=""/contact.html"" class=""cta-button"">Tillbaka till kontaktformuläret</a>
    </main>
</body>
</html>
");
        return;
    }

    // Här skulle man normalt spara data eller skicka e-post

    // Dynamisk HTML-respons med användarens data
    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.WriteAsync(@$"
<!DOCTYPE html>
<html lang=""sv"">
<head>
    <meta charset=""UTF-8"">
    <title>Tack för ditt meddelande</title>
    <link rel=""stylesheet"" href=""/css/style.css"">
</head>
<body>
    <main class=""container"">
        <h1>Ditt meddelande har skickats!</h1>
        <p>Tack för att du kontaktar oss. Vi hör av oss inom kort.</p>
        <div class=""contact-success-details"">
            <p><strong>Namn:</strong> {System.Net.WebUtility.HtmlEncode(name)}</p>
            <p><strong>E-post:</strong> {System.Net.WebUtility.HtmlEncode(email)}</p>
        </div>
        <a href=""/index.html"" class=""cta-button"">Tillbaka till startsidan</a>
    </main>
</body>
</html>
");
});

// Enkel server-side hantering av medlemsregistrering
app.MapPost("/register", async (HttpContext context) =>
{
    var form = await context.Request.ReadFormAsync();
    var name = form["name"].ToString().Trim();
    var email = form["email"].ToString().Trim();
    var phone = form["phone"].ToString().Trim();
    var plan = form["plan"].ToString().Trim();
    var payment = form["payment"].ToString().Trim();

    if (string.IsNullOrWhiteSpace(name) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(phone) ||
        string.IsNullOrWhiteSpace(plan) ||
        string.IsNullOrWhiteSpace(payment))
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.WriteAsync(@$"
<!DOCTYPE html>
<html lang=""sv"">
<head>
    <meta charset=""UTF-8"">
    <title>Registrering - fel</title>
    <link rel=""stylesheet"" href=""/css/style.css"">
</head>
<body>
    <main class=""container"">
        <h1>Fyll i alla uppgifter</h1>
        <p>Kontrollera att du har fyllt i namn, e-post, telefon, medlemskap och betalsätt.</p>
        <a href=""/registration.html"" class=""cta-button"">Tillbaka till registreringen</a>
    </main>
</body>
</html>
");
        return;
    }

    // Dynamisk HTML-respons efter att användaren har klickat "Betala"
    context.Response.ContentType = "text/html; charset=utf-8";
    await context.Response.WriteAsync(@$"
<!DOCTYPE html>
<html lang=""sv"">
<head>
    <meta charset=""UTF-8"">
    <title>Tack för din registrering</title>
    <link rel=""stylesheet"" href=""/css/style.css"">
</head>
<body>
    <main class=""container"">
        <h1>Tack! Din registrering är mottagen.</h1>
        <p>Du valde <strong>{System.Net.WebUtility.HtmlEncode(plan)}</strong>. Vi hör av oss inom kort.</p>
        <div class=""registration-success-details"">
            <p><strong>Namn:</strong> {System.Net.WebUtility.HtmlEncode(name)}</p>
            <p><strong>E-post:</strong> {System.Net.WebUtility.HtmlEncode(email)}</p>
            <p><strong>Telefon:</strong> {System.Net.WebUtility.HtmlEncode(phone)}</p>
        </div>
        <a href=""/index.html"" class=""cta-button"">Tillbaka till startsidan</a>
    </main>
</body>
</html>
");
});

app.Run();
