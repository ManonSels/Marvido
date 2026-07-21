export function Navbar() {
    return `
        <nav>
            <h1>Marvido</h1>

            <ul>
                <li><a href="/" data-link>Home</a></li>
                <li><a href="/gallery" data-link>Gallery</a></li>
                <li><a href="/availability" data-link>Availability</a></li>
                <li><a href="/contact" data-link>Contact</a></li>
            </ul>
        </nav>
    `;
}