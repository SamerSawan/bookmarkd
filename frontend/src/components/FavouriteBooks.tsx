const FavouriteBooks = () => {
    const favouriteBooks = [
      { title: "Lessons in Stoicism", cover: "http://books.google.com/books/content?id=y5GIDwAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { title: "Hardship and Happiness", cover: "http://books.google.com/books/content?id=bgjGAgAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { title: "Between Two Fires", cover: "http://books.google.com/books/content?id=2PO1MtB7E_0C&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
      { title: "Orientalism", cover: "http://books.google.com/books/content?id=npF5BAAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api" },
    ];
  
    return (
      <div className="mt-8 border-4 border-back-raised p-2 rounded-lg">
        <h2 className="text-xl font-bold text-secondary-strong mb-4">Favourite Books</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {favouriteBooks.map((book, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={book.cover}
                alt={book.title}
                className="w-48 h-72 rounded-md"
              />
              <p className="mt-2 text-md text-secondary-weak text-center">{book.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default FavouriteBooks;
  