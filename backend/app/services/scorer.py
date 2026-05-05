from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(job_description: str, resumes: list[str]):
    documents = [job_description] + resumes

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)

    job_vector = tfidf_matrix[0]
    resume_vectors = tfidf_matrix[1:]

    scores = cosine_similarity(job_vector, resume_vectors)[0]

    # 🔥 keyword extraction
    feature_names = vectorizer.get_feature_names_out()

    results = []
    for i, score in enumerate(scores):
        resume_vector = resume_vectors[i].toarray()[0]

        matched_keywords = [
            feature_names[j]
            for j in resume_vector.nonzero()[0]
            if job_vector.toarray()[0][j] > 0
        ]

        results.append({
            "score": score,
            "matched_keywords": matched_keywords[:10]  
        })

    return results