import type { PublishedCase } from '../case-studies';

export default function CaseVisual({ study }: { study: PublishedCase }) {
  const share = study.id === 'seating' ? 60.6 : study.id === 'pool' ? 91.5 : null;
  return (
    <figure className={`cm__visual cm__visual--${study.id}`}>
      <div className="cm__visual-top"><span>{share ? 'Reported share of voice' : 'Strategy, at a glance'}</span><span>0{Number(study.num)} / INSIGHT</span></div>
      {share ? <div className="cm__share-layout">
        <div className="cm__ring" role="img" aria-label={`${share}% AI Overview share of voice; remaining share ${100 - share}%`} style={{ background: `conic-gradient(var(--accent) ${share}%, #ffffff20 0)` }}><div><strong>{share}%</strong><span>AI Overview<br />share of voice</span></div></div>
        <div className="cm__share-copy"><h3>{study.id === 'seating' ? 'Expertise, cited.' : 'Present at the point of discovery.'}</h3><p>{study.id === 'seating' ? 'More than double the combined share of the next four largest competitors.' : 'Brand mentions in every one of the 14 tracked AI Overviews.'}</p><span className="cm__legend"><i /> Brand share <i /> Remaining share</span></div>
      </div> : <>
        <h3>{study.visual}</h3>
        <div className="cm__journey">{study.journey.map((step, i) => <div key={step}><span>0{i + 1}</span><strong>{step}</strong>{i < study.journey.length - 1 && <b aria-hidden="true">↗</b>}</div>)}</div>
        {study.id === 'geo' && <div className="cm__endpoint"><span>~5 <small>monthly referrals</small></span><b aria-hidden="true">→</b><span>&gt;100 <small>monthly referrals</small></span></div>}
        {study.id === 'coffee' && <div className="cm__endpoint"><span>+78% <small>AI-attributed sales</small></span><span>91% <small>AI-session engagement</small></span></div>}
      </>}
      <figcaption>{share || study.id === 'geo' || study.id === 'coffee' ? 'Figures: The SEO Works, linked below. ' : ''}{share ? 'Share within the source’s tracked query set.' : 'Original strategy diagram · not a campaign screenshot or time-series chart.'}</figcaption>
    </figure>
  );
}
