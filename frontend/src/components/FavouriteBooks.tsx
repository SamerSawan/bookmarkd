const FavouriteBooks = () => {
    const favouriteBooks = [
      { id: 1, title: "Lessons in Stoicism", cover: "https://books.google.com/books/content?id=y5GIDwAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { id: 2, title: "Hardship and Happiness", cover: "https://books.google.com/books/content?id=bgjGAgAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { id: 3, title: "Between Two Fires", cover: "https://books.google.com/books/content?id=2PO1MtB7E_0C&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { id: 4, title: "Orientalism", cover: "https://books.google.com/books/content?id=npF5BAAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
    ];
  
    return (

        <div className="mb-12">
          <h2 className="text-primary text-2xl font-bold mb-4">Favourite Books</h2>
          <div className="flex justify-center items-center">
          <div className="grid grid-cols-4 gap-4 2xl:w-[80%] mx-auto">
            {favouriteBooks.map((book) => (
              <div
                key={book.id}
                className="relative group bg-back-raised p-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="rounded-md object-cover"
                />
                <div className="absolute inset-0 bg-back-overlay bg-opacity-50 opacity-0 rounded-md group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-white text-sm font-bold">{book.title}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
    );
  };
  
  export default FavouriteBooks;
  