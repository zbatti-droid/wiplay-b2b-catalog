export function CatalogueSkeleton() {
  return (
    <main className="manufacturer-catalogue" aria-busy="true" aria-label="Loading catalogue">
      <section className="catalog-hero skeleton-hero">
        <div><span className="skeleton-line skeleton-kicker" /><span className="skeleton-line skeleton-title" /></div>
        <span className="skeleton-line skeleton-copy" />
      </section>
      <section className="catalog-layout skeleton-catalog-layout">
        <aside className="skeleton-filter"><span className="skeleton-line skeleton-filter-title" />{[1, 2, 3, 4].map(item => <span className="skeleton-line" key={item} />)}</aside>
        <div><div className="catalog-top"><span className="skeleton-line skeleton-count" /><span className="skeleton-line skeleton-sort" /></div><div className="industry-product-grid">{[1, 2, 3, 4, 5, 6].map(item => <article className="skeleton-product" key={item}><span className="skeleton-block" /><span className="skeleton-line" /><span className="skeleton-line skeleton-short" /></article>)}</div></div>
      </section>
    </main>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="manufacturer-detail" aria-busy="true" aria-label="Loading product">
      <div className="breadcrumbs"><span className="skeleton-line skeleton-breadcrumb" /></div>
      <section className="detail skeleton-detail">
        <div><span className="skeleton-block skeleton-detail-image" /><div className="skeleton-thumbs">{[1, 2, 3].map(item => <span className="skeleton-block" key={item} />)}</div></div>
        <div className="detail-copy"><span className="skeleton-line skeleton-kicker" /><span className="skeleton-line skeleton-detail-title" /><span className="skeleton-line skeleton-copy" /><span className="skeleton-line skeleton-copy" /><div className="skeleton-specs">{[1, 2, 3, 4].map(item => <span className="skeleton-line" key={item} />)}</div><span className="skeleton-button" /></div>
      </section>
    </main>
  );
}
