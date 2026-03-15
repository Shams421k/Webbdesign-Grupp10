var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Serve static files from the parent directory
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..")),
    RequestPath = ""
});

// Set index.html as the default page
app.UseDefaultFiles();

app.UseRouting();

app.MapPost("/contact", async (HttpContext context) =>
{
    var form = await context.Request.ReadFormAsync();
    var name = form["name"];
    var email = form["email"];
    var message = form["message"];

    // TODO: Process the form data (e.g., send an email, save to a database)

    await context.Response.WriteAsync($"Tack, {name}! Ditt meddelande har skickats.");
});

app.Run();
