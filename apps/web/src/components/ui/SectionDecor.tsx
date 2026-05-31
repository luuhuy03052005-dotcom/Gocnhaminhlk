/**
 * SectionDecor — Các thành phần trang trí nền chìm mờ cho từng section.
 * Tại sao dùng inline div thay vì CSS pseudo-element?
 * → Tailwind v4 purge không ổn định với custom ::before/::after classes.
 * → Mỗi element chỉ có 1 ::before, gây xung đột khi ghép 2 pattern.
 * → Inline div cho phép chồng nhiều lớp trang trí mà không bị conflict.
 */

/** Hạt nhiễu nhẹ (grain) — phủ toàn bộ section */
export const GrainOverlay = () => (
  <div 
    className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '256px',
    }}
    aria-hidden="true"
  />
);

/** Hạt cà phê rải rác */
export const CoffeeBeansPattern = () => (
  <div 
    className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='20' cy='20' rx='6' ry='10' fill='%232C2017' transform='rotate(-30 20 20)'/%3E%3Cline x1='16' y1='20' x2='24' y2='20' stroke='%23FDF6EE' stroke-width='1' transform='rotate(-30 20 20)'/%3E%3Cellipse cx='60' cy='55' rx='6' ry='10' fill='%232C2017' transform='rotate(25 60 55)'/%3E%3Cline x1='56' y1='55' x2='64' y2='55' stroke='%23FDF6EE' stroke-width='1' transform='rotate(25 60 55)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '80px',
    }}
    aria-hidden="true"
  />
);

/** Nhánh lá botanical — góc phải trên */
export const LeafCorner = () => (
  <div 
    className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none z-0 opacity-[0.05]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M400,0 Q350,50 300,30 Q250,10 200,60 Q150,110 180,180 Q200,230 160,280 Q130,320 100,300 Q60,270 40,320 Q20,370 0,400' fill='none' stroke='%23A06828' stroke-width='1.5'/%3E%3Cpath d='M400,60 Q340,80 310,50 Q270,10 230,80 Q200,140 210,200' fill='none' stroke='%23A06828' stroke-width='1'/%3E%3Ccircle cx='300' cy='30' r='4' fill='%23A06828'/%3E%3Ccircle cx='230' cy='80' r='3' fill='%23A06828'/%3E%3Ccircle cx='180' cy='180' r='5' fill='%23A06828'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top right',
      backgroundSize: 'contain',
    }}
    aria-hidden="true"
  />
);

/** Vòng tròn đồng tâm — góc trái dưới */
export const CirclesDecor = () => (
  <div 
    className="absolute -bottom-16 -left-16 w-[320px] h-[320px] pointer-events-none z-0 opacity-[0.045]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='150' cy='150' r='130' fill='none' stroke='%23C8873A' stroke-width='1'/%3E%3Ccircle cx='150' cy='150' r='90' fill='none' stroke='%23C8873A' stroke-width='0.8'/%3E%3Ccircle cx='150' cy='150' r='50' fill='none' stroke='%23C8873A' stroke-width='0.5'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
    }}
    aria-hidden="true"
  />
);

/** Ánh sáng ấm lan toả */
export const WarmGlow = () => (
  <div 
    className="absolute top-[15%] right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-[0.07]"
    style={{
      background: 'radial-gradient(circle, #C8873A 0%, transparent 70%)',
    }}
    aria-hidden="true"
  />
);

/** Chấm tròn editorial grid */
export const DotsGrid = () => (
  <div 
    className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage: 'radial-gradient(circle, #2C2017 1.2px, transparent 1.2px)',
      backgroundSize: '28px 28px',
    }}
    aria-hidden="true"
  />
);

/** Đường cong topographic — phía dưới */
export const CurvedLines = () => (
  <div 
    className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-0 opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,200 Q200,100 400,180 Q600,260 800,150 Q1000,40 1200,120' fill='none' stroke='%23A06828' stroke-width='1.5'/%3E%3Cpath d='M0,240 Q200,140 400,220 Q600,300 800,190 Q1000,80 1200,160' fill='none' stroke='%23A06828' stroke-width='1'/%3E%3Cpath d='M0,270 Q200,170 400,250 Q600,330 800,220 Q1000,110 1200,190' fill='none' stroke='%23A06828' stroke-width='0.7'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }}
    aria-hidden="true"
  />
);
