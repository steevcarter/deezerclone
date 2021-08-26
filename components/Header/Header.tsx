import { FormEvent } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import MusicIcon from "../../public/music-icon.svg";
import SearchIcon from "../../public/search-icon.svg";

type Props = {
  search: string;
  handleSearchInput: (e: FormEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const Header = ({ search, handleSearchInput, handleSearchSubmit }: Props) => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.logoLink}>
          <MusicIcon />
          <span>MusicApp2</span>
        </a>
      </Link>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <div className={[styles.searchInputWrapper, search ? styles.active : ""].join(" ")}>
          <label className={styles.searchInputLabel} htmlFor="search-songs">
            Search
          </label>
          <input
            className={styles.searchInput}
            type="search"
            name="search-songs"
            id="search-songs"
            onInput={handleSearchInput}
            value={search}
          />
        </div>
        <button className={styles.submitButton} type="submit">
          <span className="visuallyhidden">Search</span>
          <span aria-hidden="true">
            <SearchIcon />
          </span>
        </button>
      </form>
    </header>
  );
};
