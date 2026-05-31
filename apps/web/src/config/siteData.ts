const landingImage = (fileName: string) => `/images/landing/${fileName}`;

const heroImg = landingImage('hero-main.jpg');
const heroStorefront = landingImage('hero-storefront.jpg');
const heroInterior = landingImage('hero-interior.jpg');
const menuFeaturedImg = landingImage('menu-oolong-camelia.jpg');
const g1 = landingImage('gallery-front-morning.jpg');
const g2 = landingImage('gallery-corner-light.jpg');
const g3 = landingImage('gallery-chill-drink.jpg');
const g4 = landingImage('gallery-drinks.jpg');
const g5 = landingImage('gallery-barista.jpg');
const promoImg = landingImage('promo-checkin-2.jpg');
const locationImg = landingImage('promo-delivery-banner.jpg');
const dealGokaImg = landingImage('promo-goka.jpg');
const dealCheckinImg = landingImage('promo-checkin.jpg');
const dealBanner1 = landingImage('promo-banner-1.jpg');
const dealBanner2 = landingImage('promo-banner-2.jpg');
const matchaImg = landingImage('menu-matcha-coconut.jpg');
const logoImg = landingImage('brand-logo.jpg');

export type CarouselItemType = 'promo' | 'menu';

export interface BaseCarouselItem {
  id: string;
  type: CarouselItemType;
  title: string;
  image: string;
  alt: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
  badge?: string;
}

export interface PromoCarouselItem extends BaseCarouselItem {
  type: 'promo';
  price?: never; // Prevents promo from having price logically
}

export interface MenuCarouselItem extends BaseCarouselItem {
  type: 'menu';
  price: string;
}

export type CarouselHighlightItem = PromoCarouselItem | MenuCarouselItem;

export interface MenuItem {
  name: string;
  price: string;
  desc?: string;
  isBestSeller?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  alt: string;
  badge?: string;
  ctaLabel?: string;
  ctaLink?: string;
  objectPosition?: string;
}

export const siteData = {
  brand: {
    name: "Góc Nhà Mình",
    openHours: "07:00 - 22:30 Hằng Ngày",
    address: "46B, Nguyễn Trãi, Long Khánh",
    phone: "088 988 8339",
    facebook: "https://facebook.com/Gocnhaminh2026",
    tiktok: "https://www.tiktok.com/@gocnhaminh2026",
    zalo: "https://zalo.me/0889888339",
    goka: "https://gokaapp.vn/download", 
    googleMapUrl: "https://maps.app.goo.gl/vJsPUM8LEjEckps78",
    logo: logoImg
  },
  images: {
    hero: heroImg,
    heroStorefront: heroStorefront,
    heroInterior: heroInterior,
    promo: promoImg,
    location: locationImg,
    gokaBanner: dealGokaImg,
    gallery: [
      {
        id: 'gallery-1',
        title: 'Bình yên trước hiên nhà',
        subtitle: 'Sáng sớm tinh mơ',
        description: 'Đón những tia nắng đầu tiên xuyên qua tán cây, thả mình vào không gian bình lặng của một sớm Long Khánh.',
        image: g1,
        alt: 'Mặt tiền quán Góc Nhà Mình lúc sáng sớm',
        badge: 'Khởi đầu'
      },
      {
        id: 'gallery-2',
        title: 'Mộc mạc & Thân thuộc',
        subtitle: 'Như trở về nhà',
        description: 'Từng chiếc bàn gỗ, từng ánh đèn vàng đều được chúng mình chăm chút để mang lại sự ấm áp chân thật.',
        image: g2,
        alt: 'Góc phòng với ánh sáng tự nhiên',
        badge: 'Không gian'
      },
      {
        id: 'gallery-3',
        title: 'Tĩnh lặng thả trôi',
        subtitle: 'Góc nhỏ của riêng bạn',
        description: 'Một ly trà, một cuốn sách, và thời gian dường như ngừng lại ở nơi này.',
        image: g3,
        alt: 'Góc chill với nước uống',
        badge: 'Trải nghiệm',
        objectPosition: 'center 85%'
      },
      {
        id: 'gallery-4',
        title: 'Khoảnh khắc rực rỡ',
        subtitle: 'Hương & Sắc',
        description: 'Không chỉ là hương vị, mỗi đồ uống tại Góc được thiết kế như một trải nghiệm đầy màu sắc cho ngày dài.',
        image: g4,
        alt: 'Bộ sưu tập đồ uống rực rỡ',
        badge: 'Signature'
      },
      {
        id: 'gallery-5',
        title: 'Sự tỉ mỉ ngọt ngào',
        subtitle: 'Đong đầy tâm ý',
        description: 'Mỗi thức uống là một tác phẩm được chăm chút từ tận đáy lòng.',
        image: g5,
        alt: 'Pha chế đồ uống tại Góc Nhà Mình',
        badge: 'Đam mê'
      }
    ] as GalleryItem[]
  },
  menu: {
    featured: {
      name: "Trà sữa Ô long Camelia",
      price: "35,000 VND",
      desc: "Trà sữa đậm vị Ô Long nướng, kết hợp cùng lớp kem sữa muối biển mềm mịn và trân châu sợi dai ngon nguyên bản.",
      badge: "Best Seller",
      image: menuFeaturedImg
    },
    categories: [
      {
        id: "ca-phe",
        name: "CÀ PHÊ",
        items: [
          { name: "Cà đen", price: "20k" },
          { name: "Cà nâu", price: "25k" },
          { name: "Bạc xỉu \"không đắng đâu\"", price: "27k" },
          { name: "Muối mặn mà", price: "32k", isBestSeller: true },
          { name: "Kem dẻo buôn mê", price: "32k" }
        ]
      },
      {
        id: "tra",
        name: "TRÀ",
        items: [
          { name: "Đào dealine", price: "33k" },
          { name: "Nhài quế hoa", price: "33k" },
          { name: "Trà mãng cầu", price: "35k" },
          { name: "Hấu dâu fresh", price: "35k" },
          { name: "Mận đào thanh xuân", price: "37k", isBestSeller: true },
          { name: "Tropical me dứa", price: "37k", isBestSeller: true },
          { name: "Trà đác thơm", price: "37k", isBestSeller: true },
          { name: "Mãng cầu me", price: "37k", isBestSeller: true },
          { name: "Mát dừa nhiệt đới", price: "39k" }
        ]
      },
      {
        id: "tra-sua",
        name: "TRÀ SỮA",
        items: [
          { name: "Trà sữa Đen Mật", price: "25k", isBestSeller: true },
          { name: "Trà sữa full topping", price: "40k" },
          { name: "Oolong Camellia", price: "25k", isBestSeller: true },
          { name: "Tuyết Quế Hoa", price: "27k" },
          { name: "Sữa tươi đường đen", price: "29k" }
        ]
      },
      {
        id: "matcha",
        name: "MATCHA",
        items: [
          { name: "Matcha latte", price: "35k" },
          { name: "Matcha mê dừa", price: "42k", isBestSeller: true }
        ]
      },
      {
        id: "hongcha",
        name: "HONGCHA",
        items: [
          { name: "Hồng trà sương sáo", price: "25k" },
          { name: "Hồng trà trân châu", price: "28k" }
        ]
      },
      {
        id: "freeze",
        name: "FREEZE",
        items: [
          { name: "Matcha đá xay", price: "35k" },
          { name: "Cacao đá xay", price: "32k" }
        ]
      },
      {
        id: "nuoc-ep",
        name: "NƯỚC ÉP",
        items: [
          { name: "Ép cam", price: "28k" },
          { name: "Ép thơm", price: "28k" },
          { name: "Ép dưa hấu", price: "28k" }
        ]
      },
      {
        id: "nuoc-ngot",
        name: "NƯỚC NGỌT",
        items: [
          { name: "Bò hút", price: "27k" },
          { name: "Trà xanh, sting, pepsi", price: "15k" },
          { name: "Nước suối", price: "15k" }
        ]
      },
      {
        id: "foam-crush",
        name: "FOAM KEM MUỐI",
        items: [
          { name: "Hồng trà kem muối", price: "37k" },
          { name: "Oolong kem muối", price: "37k" },
          { name: "Sen vàng kem muối", price: "37k" }
        ]
      },
      {
        id: "topping",
        name: "TOPPING",
        items: [
          { name: "Trân châu đen / giòn / hoàng kim / oolong / củ năng / sương sáo", price: "7k", desc: "Đồng giá áp dụng cho 1 phần" },
          { name: "Phomai mặn Jerry / Phô Mai tươi / Kem muối", price: "8k" },
          { name: "Đác rim", price: "10k" }
        ]
      },
      {
        id: "lai-rai",
        name: "LAI RAI",
        items: [
          { name: "Bánh que chấm kem muối", price: "23k" },
          { name: "Bánh que chấm sữa", price: "23k" },
          { name: "Bánh tráng sa tế / bịch", price: "10k" },
          { name: "Hạt hướng dương", price: "10k" }
        ]
      }
    ] as MenuCategory[]
  },
  highlights: [
    {
      id: "promo-1",
      type: "promo",
      title: "Chút ngọt nhẹ ngày Thứ Bảy",
      subtitle: "KẾT NỐI",
      description: "Thêm thắt chút ngọt ngào cho cuối tuần với topping Trân Châu hoàn toàn miễn phí khi check-in tại Không Gian Quán.",
      ctaLabel: "Đến Quán Ngay",
      ctaLink: "#location",
      image: promoImg,
      alt: "Check-in free topping"
    },
    {
      id: "menu-1",
      type: "menu",
      title: "Trà Sữa Ô Long Camelia",
      price: "35,000 VND",
      description: "Đậm vị trà nướng, sánh mịn kem mặn. Thức uống gắn liền với thương hiệu Góc Nhà Mình từ ngày đầu.",
      badge: "Best Seller",
      ctaLabel: "Đặt Giao Nhận",
      ctaLink: "https://goka.app",
      image: menuFeaturedImg,
      alt: "Trà sữa Ô long Camelia"
    },
    {
      id: "promo-2",
      type: "promo",
      title: "Mọi nẻo đường, một hương vị",
      subtitle: "GIAO TẬN NƠI",
      description: "Ở nhà mà bỗng thèm cà phê Góc? Chỉ cần mở app đặt liền tay, Góc mang cà phê thật tươi mát tới cho bạn.",
      ctaLabel: "Khám phá Menu",
      ctaLink: "#menu",
      image: locationImg, // Repurposed as app banner promo image
      alt: "Giao hàng qua App"
    },
    {
      id: "menu-2",
      type: "menu",
      title: "Matcha Mê Dừa",
      price: "40,000 VND",
      description: "Lớp dừa tuyết xay mịn quyện cùng bột Matcha Uji thanh khiết, thơm lừng. Món mát lạnh cho ngày hè.",
      badge: "Mới",
      ctaLabel: "Đặt Giao Nhận",
      ctaLink: "https://goka.app",
      image: matchaImg,
      alt: "Matcha Mê Dừa"
    },
    {
      id: "promo-3",
      type: "promo",
      title: "Check-in là có quà",
      subtitle: "ƯU ĐÃI",
      description: "Chụp một bức ảnh tại quán, đăng lên Facebook kèm check-in — nhận ngay phần topping miễn phí cho ly nước bất kỳ.",
      ctaLabel: "Ghé Ngay",
      ctaLink: "#location",
      image: dealCheckinImg,
      alt: "Deal check-in free topping"
    },
    {
      id: "promo-4",
      type: "promo",
      title: "Đã có trên App giao hàng",
      subtitle: "TIỆN LỢI",
      description: "Góc Nhà Mình chính thức lên app Goka. Đặt món yêu thích giao tận nơi chỉ trong 15 phút.",
      ctaLabel: "Mở App Goka",
      ctaLink: "https://goka.app",
      image: dealGokaImg,
      alt: "Góc Nhà Mình trên Goka"
    },
    {
      id: "promo-5",
      type: "promo",
      title: "Không gian mới, cảm hứng mới",
      subtitle: "TIN MỚI",
      description: "Góc vừa hoàn thiện thêm tầng lửng với góc đọc sách riêng tư. Đến trải nghiệm ngay hôm nay nhé.",
      ctaLabel: "Xem Không Gian",
      ctaLink: "#gallery",
      image: dealBanner1,
      alt: "Không gian mới Góc Nhà Mình"
    },
    {
      id: "promo-6",
      type: "promo",
      title: "Góc ấm — nơi gặp gỡ",
      subtitle: "CÂU CHUYỆN",
      description: "Mỗi ly cà phê ở Góc đều là một cuộc hẹn nhỏ. Hẹn bạn bè, hẹn chính mình, hay hẹn một chiều yên ả.",
      ctaLabel: "Chỉ Đường",
      ctaLink: "#location",
      image: dealBanner2,
      alt: "Góc Nhà Mình câu chuyện"
    }
  ] as CarouselHighlightItem[],
  testimonials: [
    {
      author: "Ngọc Lan",
      rating: 5,
      text: "Một không gian quá đỗi lặng lẽ, nhạc nhẹ nhàng thư giãn tuyệt đối. Góc ban công phía trên là nơi tôi thường ngồi làm việc mệt mỏi nhất."
    },
    {
      author: "Tuấn Vũ",
      rating: 5,
      text: "Nước rất ngon, đặc biệt là Olong Camelia uống cực kỳ dính. Anh chủ nhiệt tình và các bạn nhân viên luôn biết giữ không gian chung êm ả."
    },
    {
      author: "Hoàng Oanh",
      rating: 5,
      text: "Quán theo phong cách Vintage không hề bị sến, mà lại có chất rất tĩnh mịch. Mình tới đọc sách cả chiều mà không cảm thấy ồn ào tí nào."
    }
  ]
};
