import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Placement Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
