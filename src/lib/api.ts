import { Writer } from "./data";

export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.BACKEND_INTERNAL_URL || "";
  }
  return ""; // client-side uses relative path for proxying to avoid CORS errors
};

export const getClientBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "";
};

export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "/assets/bg/blog-bg.png";
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};

export const mapExpertToWriter = (expert: any): Writer => {
  const name = expert.name || "Academic Expert";
  const isDrOrProf = name.includes("Dr.") || name.includes("Prof.");
  const calculatedQualifications = isDrOrProf ? "Ph.D. Qualified" : "Master's Qualified";
  
  // Calculate experience based on finished orders as a stable heuristic
  let calculatedExperience = "5+ Years";
  const finishOrder = parseInt(expert.finish_order) || 0;
  if (finishOrder > 2000) {
    calculatedExperience = "8+ Years";
  } else if (finishOrder > 1000) {
    calculatedExperience = "7+ Years";
  } else if (finishOrder > 500) {
    calculatedExperience = "6+ Years";
  }

  // Calculate average rating from reviews if available
  let calculatedRating = 4.8;
  let reviewsArray = [];
  if (expert.customer_review) {
    try {
      reviewsArray = typeof expert.customer_review === "string" 
        ? JSON.parse(expert.customer_review) 
        : expert.customer_review;
    } catch (e) {
      console.error("Error parsing customer reviews:", e);
    }
  }

  if (Array.isArray(reviewsArray) && reviewsArray.length > 0) {
    const ratings = reviewsArray.map((r: any) => parseFloat(r.rating) || 5).filter(Boolean);
    if (ratings.length > 0) {
      calculatedRating = ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length;
    }
  }

  // Map customer_review objects from database to frontend reviews format
  const mappedReviews = Array.isArray(reviewsArray) 
    ? reviewsArray.map((r: any) => {
        const namePart = r.name || "Student";
        const parts = namePart.split(",");
        const reviewerName = parts[0].trim();
        const institution = parts[1] ? parts[1].trim() : "UK University";
        
        return {
          name: reviewerName,
          institution: institution,
          rating: parseFloat(r.rating) || 5,
          quote: r.review || r.quote || "",
          avatar: reviewerName.charAt(0)
        };
      })
    : [];

  let skillsArray = [];
  if (expert.skills) {
    try {
      skillsArray = typeof expert.skills === "string" 
        ? JSON.parse(expert.skills) 
        : expert.skills;
    } catch (e) {
      console.error("Error parsing skills:", e);
    }
  }

  let helpsWithArray = [];
  if (expert.helpus) {
    try {
      helpsWithArray = typeof expert.helpus === "string" 
        ? JSON.parse(expert.helpus) 
        : expert.helpus;
    } catch (e) {
      console.error("Error parsing helpus:", e);
    }
  }

  // Fallback avatar initials or full image URL
  let avatarUrl = "";
  if (expert.image) {
    avatarUrl = getImageUrl(expert.image);
  } else {
    avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f3e8ff&color=6b21a8`;
  }

  return {
    id: expert.slug || String(expert.id),
    name: name,
    role: expert.subject ? `${expert.subject} Expert` : "Academic Expert",
    avatar: avatarUrl,
    rating: calculatedRating,
    reviewCount: reviewsArray?.length || 15, // fallback if empty reviews
    ordersCompleted: finishOrder,
    ordersInProgress: parseInt(expert.inprogress_order) || 0,
    location: expert.location || "UK Based",
    successRate: expert.success || 98,
    expertise: Array.isArray(skillsArray) && skillsArray.length > 0 ? skillsArray : [expert.subject || "Academic Writing"],
    qualifications: calculatedQualifications,
    experience: calculatedExperience,
    skills: Array.isArray(skillsArray) ? skillsArray : [],
    helpsWith: Array.isArray(helpsWithArray) && helpsWithArray.length > 0 ? helpsWithArray : ["Assignment Help", "Essay Help"],
    about: expert.content ? [expert.content.replace(/<[^>]*>/g, '')] : ["Experienced academic writer dedicated to quality work."],
    credentials: [
      { label: "Degree", value: calculatedQualifications },
      { label: "Experience", value: calculatedExperience },
      { label: "Expertise", value: expert.subject || "Academic Specialist" }
    ],
    reviews: mappedReviews
  };
};
