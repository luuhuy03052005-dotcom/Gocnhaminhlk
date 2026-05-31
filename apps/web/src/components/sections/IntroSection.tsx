import { Typography } from '../ui/Typography';
import { RevealWrapper } from '../ui/RevealWrapper';
import { WarmGlow, CirclesDecor } from '../ui/SectionDecor';

export const IntroSection = () => {
  return (
    <section className="bg-white py-24 md:py-32 relative overflow-hidden">
      <WarmGlow />
      <CirclesDecor />
      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <RevealWrapper delay={0.1}>
          <Typography variant="h2" className="max-w-[800px] mx-auto mb-10 text-[#A06828]">
            Lắng nghe tiếng thời gian trôi thật chậm bên góc hiên nhà cũ.
          </Typography>
        </RevealWrapper>

        <RevealWrapper delay={0.2}>
          <Typography variant="body" className="max-w-[600px] mx-auto text-lg md:text-xl">
            Góc Nhà Mình không chỉ là một quán cà phê, mà là một chốn đi về. Ở đây, chúng mình tôn vinh sự mộc mạc, sự kết nối chân thật của những câu chuyện chưa kể, và những ly nước được pha chế bằng tất cả sự tận tâm.
          </Typography>
        </RevealWrapper>
      </div>
    </section>
  );
};
