import APIQuery from './APIQuery.js';

const handleQuery = async (req, model) => {
    const page = req.query.page ? +req.query.page : 1;

    const features = new APIQuery(model.find(), req.query);

    features.filter().sort().limitFields().search().paginate();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);

    const totalPages = Math.ceil(totalDocs / +req.query.limit) || 0;

    return { data, page, totalDocs, totalPages };
};
export default handleQuery;
