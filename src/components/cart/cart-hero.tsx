import HeroBanner from "@/components/site/hero-banner";

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function CartHero({ title, description, eyebrow = "LockerStore" }: Props) {
  return <HeroBanner eyebrow={eyebrow} title={title} description={description} />;
}