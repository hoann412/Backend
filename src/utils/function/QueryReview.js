export const reviewData = (reviews) => {
    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((acc, cur) => acc + cur, 0);
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    return {
        reviewCount,
        averageRating,
    };
};
