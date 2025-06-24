import React from "react";

const terms = [
  {
    en: "1. Account Registration",
    bn: "১। অ্যাকাউন্ট নিবন্ধন",
    details: [
      [
        "Users must be 18 years or older to create an account.",
        "ব্যবহারকারীদের অ্যাকাউন্ট তৈরি করতে হলে ন্যূনতম ১৮ বছর বয়সী হতে হবে।",
      ],
      [
        "All information provided must be accurate.",
        "সব তথ্য সঠিকভাবে প্রদান করতে হবে।",
      ],
    ],
  },
  {
    en: "2. Booking & Payment",
    bn: "২। বুকিং ও পেমেন্ট",
    details: [
      [
        "Bookings are confirmed only after full payment via supported methods (e.g., bKash).",
        "বিকাশসহ অনুমোদিত পদ্ধতিতে সম্পূর্ণ পেমেন্টের পরই বুকিং নিশ্চিত হয়।",
      ],
    ],
  },
  {
    en: "3. Host Responsibilities",
    bn: "৩। হোস্টের দায়িত্ব",
    details: [
      [
        "Hosts must provide accurate information and ensure property cleanliness and safety.",
        "হোস্টদের সঠিক তথ্য দিতে হবে এবং বাড়ির পরিষ্কার-পরিচ্ছন্নতা ও নিরাপত্তা নিশ্চিত করতে হবে।",
      ],
    ],
  },
  {
    en: "4. Guest Responsibilities",
    bn: "৪। অতিথির দায়িত্ব",
    details: [
      [
        "Guests must respect the host’s property and avoid any damage or unlawful activity.",
        "অতিথিদের হোস্টের সম্পত্তির প্রতি সম্মান প্রদর্শন করতে হবে এবং কোনো ক্ষতি বা বেআইনি কাজ থেকে বিরত থাকতে হবে।",
      ],
    ],
  },
  {
    en: "5. Identity Verification",
    bn: "৫। পরিচয় যাচাইকরণ",
    details: [
      [
        "Hosts and guests must verify their identity through NID/passport and photo.",
        "হোস্ট ও অতিথিদের জাতীয় পরিচয়পত্র/পাসপোর্ট ও ছবি দিয়ে পরিচয় যাচাই করতে হবে।",
      ],
    ],
  },
  {
    en: "6. Service Fees",
    bn: "৬। সার্ভিস ফি",
    details: [
      [
        "We charge commission from hosts and service fees from guests, shown clearly before payment.",
        "আমরা হোস্টদের থেকে কমিশন এবং অতিথিদের থেকে সার্ভিস ফি গ্রহণ করি, যা পেমেন্টের আগে পরিষ্কারভাবে প্রদর্শিত হয়।",
      ],
    ],
  },
  {
    en: "7. Cancellations & Refunds",
    bn: "৭। বুকিং বাতিল ও রিফান্ড",
    details: [
      [
        "Cancellation policies vary by listing and may affect refund eligibility.",
        "বুকিং বাতিলের নিয়মাবলি ভিন্ন ভিন্ন লিস্টিং অনুযায়ী নির্ধারিত এবং তা রিফান্ড পাওয়ার যোগ্যতাকে প্রভাবিত করতে পারে।",
      ],
    ],
  },
  {
    en: "8. Liability Disclaimer",
    bn: "৮। দায়দায়িত্ব থেকে অব্যাহতি",
    details: [
      [
        "We are a platform only. We are not responsible for any injury, damage, or unlawful acts during the stay.",
        "আমরা শুধুমাত্র একটি প্ল্যাটফর্ম। অবস্থানের সময় কোনো দুর্ঘটনা, ক্ষতি বা বেআইনি কর্মকাণ্ডের জন্য আমরা দায়ী নই।",
      ],
    ],
  },
  {
    en: "9. Termination",
    bn: "৯। অ্যাকাউন্ট বাতিল",
    details: [
      [
        "We reserve the right to suspend or remove accounts for violations of these terms.",
        "এই শর্তাবলির লঙ্ঘনের জন্য আমরা অ্যাকাউন্ট বাতিল বা স্থগিত করার অধিকার সংরক্ষণ করি।",
      ],
    ],
  },
  {
    en: "10. Privacy & Data",
    bn: "১০। প্রাইভেসি ও ডেটা",
    details: [
      [
        "We use your data to improve our services. We do not sell your data.",
        "আমরা আমাদের সার্ভিস উন্নত করতে আপনার ডেটা ব্যবহার করি। আমরা তা বিক্রি করি না।",
      ],
    ],
  },
  {
    en: "11. Changes to Terms",
    bn: "১১। শর্তাবলির পরিবর্তন",
    details: [
      [
        "BanglaBnB may update these Terms. Continued use means you agree to the changes.",
        "BanglaBnB এই শর্তাবলি পরিবর্তন করতে পারে। ব্যবহার চালিয়ে যাওয়ার অর্থ হল আপনি পরিবর্তনগুলোতে সম্মত।",
      ],
    ],
  },
  {
    en: "12. Governing Law",
    bn: "১২। প্রযোজ্য আইন",
    details: [
      [
        "These terms are governed under the laws of Bangladesh.",
        "এই শর্তাবলি বাংলাদেশের প্রচলিত আইনের অধীনে প্রযোজ্য।",
      ],
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📜 Terms & Conditions / শর্তাবলী
      </h1>
      <div className="space-y-8">
        {terms.map((section, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold mb-2">
              {section.en} / {section.bn}
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {section.details.map(([en, bn], j) => (
                <li key={j}>
                  <p className="font-medium">{en}</p>
                  <p className="text-sm text-gray-600">{bn}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
