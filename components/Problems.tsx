function ReagentIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M22 13h20M24 13v8l-3 5v21h22V26l-3-5v-8" />
      <path d="M24 20h16M26 10v6m4-6v6m4-6v6m4-6v6M27 34h10" />
      <circle cx="31" cy="39" r="1.5" />
      <path d="m45 35 8 14H37l8-14Z" />
      <path d="M45 40v4m0 3v.5" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M10 29h21v17H18m-8-7h8m-12-5h12m-8-10h13" />
      <path d="M31 34h11l7 7v5h-5m-13 0h5" />
      <circle cx="22" cy="47" r="4" />
      <circle cx="40" cy="47" r="4" />
      <circle cx="43" cy="22" r="11" />
      <path d="M43 15v8h6" />
    </svg>
  );
}

const problems = [
  {
    text: "Poor reagent quality is affecting test accuracy.",
    icon: <ReagentIcon />,
  },
  {
    text: "Delayed reagent supply is disrupting workflow.",
    icon: <DeliveryIcon />,
  },
];

export default function Problems() {
  return (
    <section className="problems" aria-labelledby="problems-title">
      <h2 id="problems-title">
        Problems We <span>Solve</span>
      </h2>

      <div className="problems__grid">
        {problems.map((problem) => (
          <article className="problem-card" key={problem.text}>
            <div className="problem-card__icon">{problem.icon}</div>
            <p>{problem.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
