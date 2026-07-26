import { useState } from 'react';
import styles from '../../styles/Job.module.css';

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
const POSTED_WITHIN = [
  { label: 'Any time', value: '' },
  { label: 'Last 24 hours', value: '1' },
  { label: 'Last week', value: '7' },
  { label: 'Last month', value: '30' },
];

type Props = {
  companies: string[];
  locations: string[];
  tags: string[];
  onSubmit: (filters: FilterValues) => void;
};

export type FilterValues = {
  search: string;
  location: string;
  jobTypes: string[];
  companies: string[];
  locations: string[];
  tags: string[];
  remote: string;
  postedWithin: string;
  salaryMin: string;
  salaryMax: string;
  sort: string;
};

export function JobFilters({ companies, locations, tags, onSubmit }: Props) {
  const [companySearch, setCompanySearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit({
      search: data.get('search') as string,
      location: data.get('locationSearch') as string,
      jobTypes: data.getAll('jobType') as string[],
      companies: data.getAll('company') as string[],
      locations: data.getAll('location') as string[],
      tags: data.getAll('tag') as string[],
      remote: data.get('remote') as string,
      postedWithin: data.get('postedWithin') as string,
      salaryMin: data.get('salaryMin') as string,
      salaryMax: data.get('salaryMax') as string,
      sort: data.get('sort') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          name="search"
          type="text"
          placeholder="Search by title or company"
        />
        <div className={styles.searchDivider} />
        <input
          className={styles.searchInput}
          name="locationSearch"
          type="text"
          placeholder="Search by city or country"
        />
        <button
          type="submit"
          className={styles.filterBtn}
        >
          Filter jobs
        </button>
      </div>

      <div className={styles.pillRow}>
        <details className={styles.pillDetails}>
          <summary className={styles.pillSummary}>Job Type ⌄</summary>
          <div className={styles.pillPanel}>
            {JOB_TYPES.map((type) => (
              <label
                key={type}
                className={styles.checkRow}
              >
                <input
                  type="checkbox"
                  name="jobType"
                  value={type}
                />
                {type.replace('_', ' ')}
              </label>
            ))}
          </div>
        </details>

        <details className={styles.pillDetails}>
          <summary className={styles.pillSummary}>Company ⌄</summary>
          <div className={styles.pillPanel}>
            <input
              className={styles.pillSearchInput}
              type="text"
              placeholder="Search companies..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
            />
            {companies
              .filter((c) =>
                c.toLowerCase().includes(companySearch.toLowerCase()),
              )
              .map((c) => (
                <label
                  key={c}
                  className={styles.checkRow}
                >
                  <input
                    type="checkbox"
                    name="company"
                    value={c}
                  />{' '}
                  {c}
                </label>
              ))}
          </div>
        </details>

        <details className={styles.pillDetails}>
          <summary className={styles.pillSummary}>Location ⌄</summary>
          <div className={styles.pillPanel}>
            <input
              className={styles.pillSearchInput}
              type="text"
              placeholder="Search locations..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
            {locations
              .filter((l) =>
                l.toLowerCase().includes(locationSearch.toLowerCase()),
              )
              .map((l) => (
                <label
                  key={l}
                  className={styles.checkRow}
                >
                  <input
                    type="checkbox"
                    name="location"
                    value={l}
                  />{' '}
                  {l}
                </label>
              ))}
          </div>
        </details>

        <details className={styles.pillDetails}>
          <summary className={styles.pillSummary}>Tags ⌄</summary>
          <div className={styles.pillPanel}>
            <input
              className={styles.pillSearchInput}
              type="text"
              placeholder="Search skills..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />
            {tags
              .filter((t) => t.toLowerCase().includes(tagSearch.toLowerCase()))
              .map((t) => (
                <label
                  key={t}
                  className={styles.checkRow}
                >
                  <input
                    type="checkbox"
                    name="tag"
                    value={t}
                  />{' '}
                  {t}
                </label>
              ))}
          </div>
        </details>

        <select
          className={styles.select}
          name="remote"
          defaultValue=""
        >
          <option value="">Remote: All</option>
          <option value="true">Remote only</option>
          <option value="false">On-site only</option>
        </select>
      </div>

      <div className={styles.moreFilters}>
        <div className={styles.moreFiltersRow}>
          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
              htmlFor="postedWithin"
            >
              Posted Within
            </label>
            <select
              className={styles.select}
              id="postedWithin"
              name="postedWithin"
              defaultValue=""
            >
              {POSTED_WITHIN.map(({ label, value }) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
              htmlFor="salaryMin"
            >
              Salary Min
            </label>
            <input
              className={styles.numberInput}
              type="number"
              id="salaryMin"
              name="salaryMin"
              min={0}
              placeholder="$0"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
              htmlFor="salaryMax"
            >
              Salary Max
            </label>
            <input
              className={styles.numberInput}
              type="number"
              id="salaryMax"
              name="salaryMax"
              min={0}
              placeholder="Any"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label
              className={styles.fieldLabel}
              htmlFor="sort"
            >
              Sort By
            </label>
            <select
              className={styles.select}
              id="sort"
              name="sort"
              defaultValue="newest"
            >
              <option value="newest">Date — Newest</option>
              <option value="oldest">Date — Oldest</option>
              <option value="salaryDesc">Salary — High to Low</option>
              <option value="salaryAsc">Salary — Low to High</option>
            </select>
          </div>
          <div className={styles.actionsRow}>
            <button
              type="reset"
              className={styles.clearBtn}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
