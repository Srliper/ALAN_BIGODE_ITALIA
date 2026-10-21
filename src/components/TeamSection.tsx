import { Crown, Instagram } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useSiteData } from '@/context/SiteData';
import { isOwner } from '@/data/team';
import { instagramHandle } from '@/config';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

const TeamSection = () => {
  const { team } = useSiteData();
  if (!team.length) return null;

  return (
    <section id="team" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading eyebrow="Quem faz a Bigode Italia" title="Nossa Equipe" />

        <div className="flex flex-wrap justify-center gap-8">
          {team.map((member) => {
            const owner = isOwner(member);
            return (
              <article
                key={member.name}
                className={`w-full max-w-xs bg-gradient-card rounded-2xl border p-8 text-center flex flex-col items-center ${
                  owner ? 'border-primary/60 shadow-xl shadow-black/40' : 'border-primary/20'
                }`}
              >
                <div className="relative mb-5">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      loading="lazy"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-32 h-32 rounded-full bg-secondary border-2 border-primary flex items-center justify-center font-display text-4xl font-bold text-gradient-gold"
                    >
                      {initials(member.name)}
                    </div>
                  )}
                  {owner && (
                    <span className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg">
                      <Crown className="w-5 h-5 text-primary-foreground" />
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-foreground">{member.name}</h3>
                <p className="text-primary uppercase tracking-[0.2em] text-xs font-semibold mt-1 mb-4">{member.role}</p>
                {member.bio && <p className="text-muted-foreground mb-6 flex-1">{member.bio}</p>}

                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/40 rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Instagram className="w-4 h-4" /> {instagramHandle(member.instagram)}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
