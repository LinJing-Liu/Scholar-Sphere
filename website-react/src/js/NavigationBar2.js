import { Link } from "react-scroll";

const Navbar = () => {


  return (
    <nav className="navbar">
      <Link
        activeClass="active"
        to="welcome"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
      >
        Home
      </Link>
      <Link
        activeClass="active"
        to="flashcards"
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
      >
        Flashcards
      </Link>
    </nav>
  );
};

export default Navbar;