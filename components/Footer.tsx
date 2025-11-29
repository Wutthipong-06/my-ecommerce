const year = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; {year} My E-commerce Site. All rights reserved.</p>
        </footer>
    )
}