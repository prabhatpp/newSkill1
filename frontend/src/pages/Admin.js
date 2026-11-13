import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Home from './Home';
import Courses from './Courses';
import Books from './Books';

const sectionDetails = {
  '/courses': {
    icon: '◈',
    eyebrow: 'CAREER DISCOVERY',
    description: 'Browse the career paths and streams available to students.'
  },
  '/books': {
    icon: '▤',
    eyebrow: 'LEARNING LIBRARY',
    description: 'Browse NCERT books and check the current catalogue.'
  }
};

function Admin() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/admin/overview');
      setOverview(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Dashboard data could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const stats = overview ? [
    { label: 'Courses', value: overview.courses, icon: '◈', tone: 'violet', note: 'Career paths listed' },
    { label: 'Streams', value: overview.streams, icon: '⌘', tone: 'blue', note: 'Areas of study' },
    { label: 'NCERT books', value: overview.books, icon: '▤', tone: 'amber', note: 'Books in catalogue' }
  ] : [];

  return (
    <div className="admin-page">
      <div className="admin-topline">
        <div className="admin-breadcrumb"><span>EduPath</span><span className="admin-breadcrumb-separator">/</span><strong>Admin</strong></div>
        <span className="admin-role"><span className="admin-role-dot" /> ADMIN WORKSPACE</span>
      </div>

      <nav className="admin-view-tabs" aria-label="Admin page sections">
        <a className="admin-view-tab" href="#admin-overview">Overview</a>
        <a className="admin-view-tab" href="#admin-public-home">Public home</a>
        <a className="admin-view-tab" href="#admin-public-courses">Courses</a>
        <a className="admin-view-tab" href="#admin-public-books">NCERT books</a>
      </nav>

      <section className="admin-welcome" id="admin-overview">
        <div className="admin-welcome-copy">
          <span className="admin-kicker">OVERVIEW</span>
          <h1>Good to see you, admin.</h1>
          <p>Keep an eye on your learning resources and jump into a section when you need to.</p>
        </div>
        <div className="admin-welcome-side">
          <article className="admin-visit-card" aria-live="polite">
            <span className="admin-visit-card-label">WEBSITE VIEWER COUNT</span>
            <strong>{overview ? Number(overview.visits || 0).toLocaleString('en-IN') : loading ? '…' : '—'}</strong>
            <span className="admin-visit-card-note">Total website opens and reloads</span>
          </article>
          <button className="admin-refresh" type="button" onClick={loadOverview} disabled={loading}>
            <span className={loading ? 'admin-refresh-icon is-spinning' : 'admin-refresh-icon'} aria-hidden="true">↻</span>
            {loading ? 'Updating…' : 'Refresh data'}
          </button>
        </div>
        <div className="admin-welcome-mark" aria-hidden="true">E</div>
      </section>

      <section className="admin-section" aria-labelledby="admin-stats-heading">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">YOUR PLATFORM</span>
            <h2 id="admin-stats-heading">At a glance</h2>
          </div>
          {overview && !loading && <span className="admin-live-status"><span /> Live data</span>}
        </div>

        {error && (
          <div className="admin-error" role="alert">
            <span className="admin-error-icon" aria-hidden="true">!</span>
            <div><strong>Unable to load overview</strong><p>{error}</p></div>
            <button type="button" onClick={loadOverview} disabled={loading}>Try again</button>
          </div>
        )}

        {loading && !overview ? (
          <div className="admin-stats-grid" aria-label="Loading dashboard data" aria-busy="true">
            {[1, 2, 3].map(item => <div className="admin-stat-card admin-skeleton-card" key={item}><span /><span /><span /></div>)}
          </div>
        ) : overview && (
          <div className="admin-stats-grid" aria-live="polite">
            {stats.map(stat => (
              <article className="admin-stat-card" key={stat.label}>
                <div className="admin-stat-top"><span className={`admin-stat-icon ${stat.tone}`} aria-hidden="true">{stat.icon}</span><span className="admin-stat-label">{stat.label}</span></div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-note">{stat.note}</div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section admin-manage-section" aria-labelledby="admin-manage-heading">
        <div className="admin-section-heading">
          <div>
            <span className="admin-kicker">QUICK ACCESS</span>
            <h2 id="admin-manage-heading">Explore your sections</h2>
          </div>
          <span className="admin-section-count">{overview?.sections?.length || 0} sections</span>
        </div>
        {overview?.sections?.length > 0 ? (
          <div className="admin-sections-grid">
            {overview.sections.map((section, index) => {
              const details = sectionDetails[section.path] || { icon: '↗', eyebrow: 'PLATFORM SECTION', description: 'Open this section to explore its content.' };
              return (
                <Link className="admin-section-card" to={section.path} key={section.path}>
                  <span className={`admin-section-icon section-icon-${index % 2}`} aria-hidden="true">{details.icon}</span>
                  <span className="admin-section-eyebrow">{details.eyebrow}</span>
                  <strong>{section.name}</strong>
                  <span className="admin-section-description">{details.description}</span>
                  <span className="admin-section-link">Open section <span aria-hidden="true">↗</span></span>
                </Link>
              );
            })}
          </div>
        ) : !loading && !error ? (
          <div className="admin-empty-state">No sections are available right now.</div>
        ) : null}
      </section>

      <section className="admin-public-content" id="admin-public-home" aria-labelledby="admin-public-home-heading">
        <div className="admin-public-heading"><span className="admin-kicker">PUBLIC WEBSITE</span><h2 id="admin-public-home-heading">Home page</h2></div>
        <Home />
      </section>

      <section className="admin-public-content" id="admin-public-courses" aria-labelledby="admin-public-courses-heading">
        <div className="admin-public-heading"><span className="admin-kicker">PUBLIC WEBSITE</span><h2 id="admin-public-courses-heading">All courses</h2></div>
        <Courses />
      </section>

      <section className="admin-public-content" id="admin-public-books" aria-labelledby="admin-public-books-heading">
        <div className="admin-public-heading"><span className="admin-kicker">PUBLIC WEBSITE</span><h2 id="admin-public-books-heading">All NCERT books</h2></div>
        <Books />
      </section>

      <footer className="admin-footer"><span className="admin-footer-mark">E</span><span>EduPath Admin</span><span className="admin-footer-divider">·</span><span>Manage your learning platform</span></footer>
    </div>
  );
}

export default Admin;
